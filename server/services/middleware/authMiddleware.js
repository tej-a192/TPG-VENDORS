const { ClerkExpressWithAuth } = require("@clerk/clerk-sdk-node");

const requireAuth = ClerkExpressWithAuth({
  audience: process.env.CLERK_JWT_AUDIENCE,
});

module.exports = requireAuth;
