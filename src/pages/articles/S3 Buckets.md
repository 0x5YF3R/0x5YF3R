---
title: Locking Down Your S3 Buckets Without Losing Your Mind
category: blue-team
tags:
  - "#CloudSecurity"
date: 05/15/2025
excerpt: Amazon S3 is the kind of service you spin up in an afternoon—then spend the next year tightening the screws after you read one of those “massive data leak” headlines.
connections:
  - Cloud Security Due Diligence
---
# Because nothing says “oops” like a world‑readable bucket.

Amazon S3 is the kind of service you spin up in an afternoon—then spend the next year tightening the screws after you read one of those “massive data leak” headlines. Buckets look deceptively simple: drop files in, grab them out. Behind the scenes you’re dealing with a global object store, a handful of overlapping permission models, and a fast‑moving security feature set that keeps growing each re:Invent. The good news is that you can lock things down without becoming a full‑time cloud plumber. Let’s walk through the bits that matter and the pitfalls that bite.

---

## The Public Bucket Problem, Revisited

Most horror stories start with an **overly friendly bucket policy or ACL**. In the early days you could tick a single “read for everyone” box in the console and—bam—your wedding photos, API keys, and customer archives got equal airtime. Amazon’s newer **Block Public Access** setting is basically a master kill‑switch. Flip it on at the account level, and S3 ignores any policy, ACL, or role trying to open the bucket to the world.  

If you inherited an older account, run this once and breathe:

```bash
aws s3control put-public-access-block   --account-id 123456789012   
--public-access-block-configuration BlockPublicAcls=true,
IgnorePublicAcls=true,BlockPublicPolicy=true,RestrictPublicBuckets=true
```

It still pays to check existing buckets with **Access Analyzer for S3**. Analyzer crawls policies and ACLs then flags anything that might leak beyond the account boundary. Treat the warnings like smoke alarms—ignore one and the fire spreads fast.

---

## Death of the ACL (Almost)

Amazon would love everyone to ditch legacy ACLs and switch to modern **Object Ownership** set to “Bucket owner enforced.” Once enabled, ACLs are flat‑out disabled—no more per‑object ACL fun, no more guessing who owns a file. Everything is controlled by IAM policies and bucket policies:

```bash
aws s3api put-bucket-ownership-controls   --bucket prod-data   --ownership-controls Rules=[{ObjectOwnership=BucketOwnerEnforced}]
```

If you’re still sharing buckets with external vendors, move them to their own bucket and wire up a resource policy that grants **least‑privilege** IAM access instead. Cross‑account ACLs are a shortcut every attacker knows how to abuse.

---

## Encryption Isn’t Optional Anymore

AWS quietly turned on server‑side encryption by default in 2023, but you have choices and they matter.

* **SSE‑S3**: Amazon’s managed keys, no extra charge. Great for dev buckets and throwaway data.
* **SSE‑KMS**: You control the key in AWS KMS. Lets you rotate keys, add key policies, and log every decrypt. A must for anything remotely sensitive.
* **DSSE‑S3**: Dual‑layer encryption that wraps objects twice with distinct keys. It’s new and a bit pricier, aimed at compliance regimes that require “separation of duties.”

Enforce the algorithm you want with a bucket policy guardrail:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "DenyUnencryptedPayloads",
      "Effect": "Deny",
      "Principal": "*",
      "Action": "s3:PutObject",
      "Resource": "arn:aws:s3:::prod-data/*",
      "Condition": {
        "StringNotEquals": {
          "s3:x-amz-server-side-encryption": "aws:kms"
        }
      }
    }
  ]
}
```

---

## Logging: If It’s Not Logged, It Didn’t Happen

Two switches matter more than the rest:

1. **CloudTrail Data Events for S3** record every single object‑level API call—gets, puts, deletes, the works. They’re chatty but gold when you need to answer, “Who downloaded our entire backup at 3 a.m.?”
2. **Server Access Logs** drop Apache‑style entries into a sibling bucket. They’re cheap, but parsing them in 2025 without Athena feels medieval. Point Athena or Amazon OpenSearch at the log bucket, build a dashboard, and forget about the raw files.

Couple those with **Amazon GuardDuty Malware Protection for S3** so that every new object gets a lightweight scan. It’s pay‑per‑byte and won’t catch everything, but it stops the classic ransomware payload from slipping in unnoticed.

---

## IAM: Roles Over Users, Policies Over Chaos

Create one role per workload, attach a narrow policy, and rotate keys via **IAM roles for service accounts** if you’re on EKS or ECS. Don’t let developers embed long‑lived access keys in CI/CD variables. If you need temporary credentials, **AWS STS with AssumeRole** is the pattern.

Remember that policies stack: a deny in any policy wins over an allow. Use that to your advantage. Create a top‑level **Service Control Policy** in AWS Organizations that denies `s3:PutBucketPublic*` and `s3:DeleteBucket` in production accounts. Even root can’t override an SCP.

---

## MFA Delete: The Forgotten Lifeline

Enable **MFA Delete** on buckets holding irreplaceable data. It forces multi‑factor auth for version deletion and permanent object removal. You can’t enable it from the console; brew some coffee and do it via the root account and `PutBucketVersioning`. Yes, it adds friction. That’s the point.

---

## Versioning + Replication: Backup Without Backup Software

Turn on **Versioning** so every overwrite becomes a historical object. Then turn on **Cross‑Region Replication** to a second AWS region with its own KMS key. If an attacker nukes `us-east-1`, you still have copies in `eu-central-1`. Combine replication with **Object Lock in Compliance mode** for buckets storing audit trails; Object Lock prevents deletes for a time window you set, satisfying a pile of regulatory checkboxes without third‑party tooling.

---

## Continuous Scanning Beats Annual Audits

Static policies age like milk. Wire up:

* **AWS Config Rules** such as `s3-bucket-public-read-prohibited`.
* An **EventBridge** rule to page you when Config drifts.
* A nightly **AWS Lambda** that cross‑checks bucket tags, verifying encryption, versioning, and logging flags.  

That loop—scan, alert, remediate—keeps your security posture current even when product teams are shipping changes at 2 a.m.

---

## Parting Thoughts

S3 offers enough switches to turn the simplest object store into a fortress, but the interface still lets you hang yourself with three mouse clicks. Start by blocking public access, forcing encryption, and logging everything, then layer in IAM rigor, versioning, and continuous monitoring. Treat buckets like production databases instead of file shares and you’ll dodge the breach headlines others keep generating.
