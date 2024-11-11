# cf-images

To install dependencies:

```bash
bun install
```

To run:

```bash
bun run index.ts
```

This project was created using `bun init` in bun v1.1.0. [Bun](https://bun.sh) is a fast all-in-one JavaScript runtime.

# CFImages - Security Best Practices

## ⚠️ Important Security Considerations

### 1. Server-Side Only Usage

This library is designed for server-side use only. Never use it in client-side code or expose your Cloudflare credentials in the browser.

```typescript
// ❌ NEVER DO THIS (client-side code)
const uploader = new CFImages({
  token: "your-token", // NEVER expose tokens in client code
  accountId: "your-id",
});

// ✅ DO THIS (server-side code)
const uploader = new CFImages({
  token: process.env.CLOUDFLARE_TOKEN,
  accountId: process.env.CLOUDFLARE_ACCOUNT_ID,
});
```

### 2. Environment Variables

Always use environment variables or a secure secrets management system to handle credentials:

```bash
# .env
CLOUDFLARE_TOKEN=your-token-here
CLOUDFLARE_ACCOUNT_ID=your-account-id-here
```

### 3. Secure Implementation Example

Here's a complete example of a secure implementation:

```typescript
// config/cloudflare.ts
import { CFImages } from "your-library";
import dotenv from "dotenv";

export function createSecureUploader() {
  dotenv.config();

  if (!process.env.CLOUDFLARE_TOKEN || !process.env.CLOUDFLARE_ACCOUNT_ID) {
    throw new Error("Missing required Cloudflare credentials");
  }

  return new CFImages({
    token: process.env.CLOUDFLARE_TOKEN,
    accountId: process.env.CLOUDFLARE_ACCOUNT_ID,
  });
}

// api/upload.ts
import express from "express";
import { createSecureUploader } from "../config/cloudflare";

const router = express.Router();

router.post(
  "/upload",
  authMiddleware, // Implement your authentication
  async (req, res) => {
    const uploader = createSecureUploader();
    // Handle upload...
  }
);
```

### 4. Additional Security Recommendations

- Implement proper authentication and authorization
- Use rate limiting to prevent abuse
- Validate file types and sizes
- Implement proper error handling
- Use HTTPS for all API endpoints
- Regularly rotate your Cloudflare tokens
- Monitor API usage for suspicious activity

### 5. Security Checklist

- [ ] Credentials stored in environment variables
- [ ] Authentication implemented
- [ ] Rate limiting in place
- [ ] File validation implemented
- [ ] Error handling configured
- [ ] HTTPS enabled
- [ ] Monitoring set up
- [ ] Token rotation plan in place

## Need Help?

If you're unsure about any security aspects, please:

1. Review our [Security Guide](link-to-guide)
2. Check our [Example Implementation](link-to-example)
3. Open an issue for security-related questions

Remember: Security is a shared responsibility. While this library implements security best practices, proper implementation in your application is crucial.
