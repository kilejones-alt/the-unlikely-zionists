# Private intake: pre-launch requirements

This GitHub repository is public. Do not publish any submitted story, identity, correspondence, unreviewed image, credentials, private media, or participant database in this repository or on GitHub Pages.

The tested **development** API source is bundled separately in the `The_Unlikely_Zionists_GitHub_Ready.zip` archive prepared for the owner. The public repository is not currently serving that private backend.

Before enabling real submissions:

1. Deploy the Python FastAPI server to a separate HTTPS host with a private persistent database and upload storage volume. Do not deploy its data to static hosting or the repository.
2. Configure an actual strong ADMIN_PASSWORD and restrict admin sessions; implement rate limits, CSRF protections, session security, MFA, and audit logs before accepting real sensitive stories.
3. Review and publish the notice describing collected information, image permissions, anonymity limitations, data retention, deletion requests, and moderation/consent process. Obtain independent consent to publish text and each uploaded image.
4. Validate all uploaded content, MIME and size limitations, re-encode images to remove EXIF, scan uploads, and back up encrypted private data.
5. Test that `/api/stories` creates **pending** records and that unapproved text/images never appear on public endpoints. Publishing must require *explicit participant consent* plus a deliberate editor approval action.
6. Reconfigure frontend endpoint URLs to the real private API and run end-to-end user, moderator, accessibility, and security testing.
7. Until this is done, do not invite people to submit private stories, photos, or personal information to the public site.

GitHub Pages serves the frontend only. It cannot run Python/FastAPI or safely hold private uploads.
