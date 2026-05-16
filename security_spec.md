# GCN Security Specification

## Data Invariants
- Every post must have a valid authorId matching the authenticated user.
- Messages must be between two valid users.
- AI bot messages (senderId: 'ai-bot') can only be created via server-side logic (though for this prototype, we allow client if isAi: true for simplicity, but in production this would be gated).

## The Dirty Dozen Payloads (Rejection Targets)
1. Post with someone else's UID as author.
2. Post with 1MB of text content (exceeding system limits).
3. Update post content of another user.
4. Read private messages between two other users.
5. Create a user profile with `isAdmin: true` manually.
6. Delete a community owned by someone else.
7. Inject HTML/Script into post content (sanitization check).
8. Anonymous post creation.
9. Rapid-fire post creation (rate limiting).
10. Update `createdAt` timestamp.
11. Create a comment on a non-existent post.
12. Read private community posts without membership.

## Test Runner (Draft)
- `test('prevent spoofing authorId')` -> EXPECT PERMISSION_DENIED
- `test('prevent reading others messages')` -> EXPECT PERMISSION_DENIED
