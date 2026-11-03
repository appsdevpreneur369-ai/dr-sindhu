#!/usr/bin/env python3
"""
PRODUCTION setup for Dr. Sindhu Dental Clinic on ClinicFlow247 -- run by the owner (SUPER_ADMIN).
Owner's decision, 3 Nov 2026: go live with the staging placeholders (registration numbers
PENDING-VERIFICATION-DRSDC-*, plus-alias staff emails, fees 0) and correct them later in the admin screens.

Every step is safe to re-run:
  1. Onboards the clinic from tenant/dr-sindhu.json with clinicflow-api/tools/tenant-onboarding/onboard_tenant.py:
     clinic (ENTERPRISE = white-label), branch, clinic admin + 3 doctors (invite emails), FAQs, treatments, pages.
     Branding is copied from the tested staging clinic: theme tokens + logo; favicon from the production website.
  2. Sets the clinic ACTIVE, 15-minute slots, Mon-Sat 10:00-21:00 with a 14:00-17:00 break per doctor.
  3. Switches the Dental suite ON (keeps any other feature override).
  4. Prints a summary and writes scripts/prod/onboard_report_prod.json (no secrets).

The password is asked for at the prompt and never written anywhere.

    python scripts/prod/setup-production.py --admin-email <super admin email>
"""
import argparse
import getpass
import json
import subprocess
import sys
import urllib.error
import urllib.request
from pathlib import Path

PROD = "https://clinicflow-api-1071497363324.asia-south1.run.app/api/v1"
STAGING_PUBLIC = "https://clinicflow-api-staging-1071497363324.asia-south1.run.app/api/v1/clinics/public/dr-sindhu-dental-clinic"
SLUG = "dr-sindhu-dental-clinic"
FAVICON = "https://drsdc-frontend-1071497363324.asia-south1.run.app/icon.png"
HERE = Path(__file__).resolve().parent
REPO = HERE.parent.parent
CONFIG = REPO / "tenant" / "dr-sindhu.json"
ONBOARD = Path(r"D:\ClinicFlow\clinicflow-api\tools\tenant-onboarding\onboard_tenant.py")


def call(base, method, path, token=None, body=None):
    req = urllib.request.Request(base + path, method=method,
                                 data=json.dumps(body).encode() if body is not None else None,
                                 headers={"Content-Type": "application/json",
                                          **({"Authorization": "Bearer " + token} if token else {})})
    try:
        with urllib.request.urlopen(req, timeout=30) as r:
            raw = r.read().decode()
            data = json.loads(raw) if raw else None
            return r.status, (data.get("data", data) if isinstance(data, dict) and "success" in data else data)
    except urllib.error.HTTPError as e:
        return e.code, e.read().decode()[:300]


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--admin-email", required=True)
    ap.add_argument("--base-url", default=PROD)
    args = ap.parse_args()
    base = args.base_url.rstrip("/")
    password = getpass.getpass(f"SUPER_ADMIN password for {args.admin_email} (PRODUCTION): ")

    status, auth = call(base, "POST", "/auth/login", body={"email": args.admin_email, "password": password})
    role = (auth.get("user") or {}).get("role") if isinstance(auth, dict) else None
    if status != 200 or role not in ("SUPER_ADMIN", "ROLE_SUPER_ADMIN"):
        sys.exit(f"Login failed or not a super admin (HTTP {status}, role {role}).")
    token = auth["accessToken"]
    print("Signed in to PRODUCTION as super admin.")

    # 1. Config = tenant file + staging's tested branding
    config = json.loads(CONFIG.read_text(encoding="utf-8"))
    with urllib.request.urlopen(STAGING_PUBLIC, timeout=30) as r:
        staging = json.loads(r.read().decode())
    clinic = config["clinic"]
    clinic["plan"] = "ENTERPRISE"
    clinic["themeTokens"] = staging.get("themeTokens") or {}
    clinic["logoUrl"] = staging.get("logoUrl")
    clinic["appTitle"] = staging.get("appTitle") or "Dr. Sindhu Dental Clinic"
    clinic["faviconUrl"] = FAVICON
    for d in config.get("doctors", []):
        reg = d.get("mciRegistrationNumber") or ""
        if reg.startswith("PENDING-VERIFICATION-") and "-DRSDC-" not in reg:
            d["mciRegistrationNumber"] = reg.replace("PENDING-VERIFICATION-", "PENDING-VERIFICATION-DRSDC-", 1)
    staged = HERE / "dr-sindhu.production.json"
    staged.write_text(json.dumps(config, indent=2), encoding="utf-8")
    print(f"Theme tokens from staging: {len(clinic['themeTokens'])}, logo: {'yes' if clinic['logoUrl'] else 'no'}")

    print("\nOnboarding (clinic, branch, admin, doctors, content, treatments) ...")
    rc = subprocess.call([sys.executable, str(ONBOARD), "--base-url", base,
                          "--admin-email", args.admin_email, "--admin-password", password,
                          "--config", str(staged), "--images-dir", str(REPO / "images"),
                          "--report", str(HERE / "onboard_report_prod.json")])
    if rc != 0:
        sys.exit("onboard_tenant.py failed -- see its output above. Re-running this script is safe.")

    # 2. Find the clinic, activate, slots, schedules
    status, clinics = call(base, "GET", "/clinics?search=sindhu", token)
    c = next((x for x in (clinics if status == 200 else []) if x.get("slug") == SLUG), None)
    if not c:
        sys.exit(f"Clinic {SLUG} not found after onboarding (HTTP {status}).")
    cid = c["id"]
    if c.get("status") != "ACTIVE":
        print("Activate clinic:", call(base, "PUT", f"/clinics/{cid}", token, {"status": "ACTIVE"})[0])
    status, doctors = call(base, "GET", f"/clinics/{cid}/doctors", token)
    for d in doctors if status == 200 else []:
        print(f"  Dr. {d.get('firstName')} {d.get('lastName')}: 15-min slots",
              call(base, "PUT", f"/clinics/{cid}/doctors/{d['id']}", token, {"appointmentDurationMinutes": 15})[0])
        _, assigned = call(base, "GET", f"/clinics/{cid}/doctors/{d['id']}/branches", token)
        if not assigned:
            print("    WARNING: not assigned to any branch -- no schedule set")
        for a in assigned or []:
            _, existing = call(base, "GET", f"/clinics/{cid}/doctors/{d['id']}/schedules", token)
            have = {(s.get("dayOfWeek"), s.get("branchId")) for s in (existing if isinstance(existing, list) else [])}
            for dow in range(1, 7):  # Mon-Sat (1 = Monday)
                if (dow, a["branchId"]) in have:
                    continue
                call(base, "POST", f"/clinics/{cid}/doctors/{d['id']}/schedules", token,
                     {"branchId": a["branchId"], "dayOfWeek": dow, "startTime": "10:00", "endTime": "21:00",
                      "breakStart": "14:00", "breakEnd": "17:00", "isActive": True})
            print(f"    schedule Mon-Sat 10-21 (break 14-17) at {a.get('branchName')}")

    # 3. Dental suite ON, keeping other overrides
    _, full = call(base, "GET", f"/clinics/{cid}", token)
    overrides = dict((full or {}).get("featureOverrides") or {})
    overrides["dental_suite"] = True
    print("Dental suite ON:", call(base, "PATCH", f"/clinics/{cid}/features", token, {"overrides": overrides})[0])

    # 4. Summary
    _, full = call(base, "GET", f"/clinics/{cid}", token)
    _, pub = call(base, "GET", f"/clinics/public/{SLUG}")
    summary = {
        "clinicId": cid, "slug": SLUG, "status": (full or {}).get("status"), "plan": (full or {}).get("plan"),
        "whiteLabel": (pub or {}).get("whiteLabel") if isinstance(pub, dict) else None,
        "bookingAvailable": (pub or {}).get("bookingAvailable") if isinstance(pub, dict) else None,
        "doctors": len(doctors) if isinstance(doctors, list) else None,
        "dentalSuite": ((full or {}).get("featureOverrides") or {}).get("dental_suite"),
    }
    (HERE / "prod_summary.json").write_text(json.dumps(summary, indent=2), encoding="utf-8")
    print("\nSUMMARY:", json.dumps(summary))
    print("Invite emails went to the staff plus-aliases (your Gmail inbox): open each to set a password.")


if __name__ == "__main__":
    main()
