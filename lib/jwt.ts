import { SignJWT, jwtVerify, type JWTPayload } from 'jose';

// Define the secret key. In production, this must be stored in environment variables.
const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-development-key-change-me';
const secretKey = new TextEncoder().encode(JWT_SECRET);

// Custom Payload Type exactly as requested
export interface CustomJWTPayload extends JWTPayload {
  sub: string; // User ID
  role: string;
}

/**
 * Sign and generate a JWT using strict HS256 algorithm.
 * @param payload - The payload containing sub, role
 * @param expiresIn - Expiration time (e.g. '15m' or '7d')
 */
export async function signToken(payload: { sub: string; role: string }, expiresIn: string): Promise<string> {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(expiresIn)
    .sign(secretKey);
}

/**
 * Verify a JWT enforcing exactly 'HS256' to prevent Algorithm Confusion Attacks.
 * Rejects 'none' alg automatically by specifying the expected algorithm.
 * @param token - The JWT string
 */
export async function verifyToken(token: string): Promise<CustomJWTPayload> {
  try {
    const { payload } = await jwtVerify(token, secretKey, {
      algorithms: ['HS256'], // EXPLICITLY REQUIRE HS256 ONLY
    });
    return payload as CustomJWTPayload;
  } catch (error) {
    throw new Error('Invalid or expired token');
  }
}
