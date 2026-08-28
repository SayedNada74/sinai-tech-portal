"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const API_BASE = 'http://localhost:3001/api';
async function runTests() {
    console.log("=========================================");
    console.log("🛡️  Sinai Tech Portal — Security Audit Test Suite");
    console.log("=========================================\n");
    let passed = 0;
    let failed = 0;
    function assert(condition, testName, errorMessage) {
        if (condition) {
            console.log(`✅ [PASS] ${testName}`);
            passed++;
        }
        else {
            console.error(`❌ [FAIL] ${testName} - ${errorMessage}`);
            failed++;
        }
    }
    // 1. Static Code Analysis Tests (Passwords, Secrets, Payload)
    console.log("\n--- Phase 1: Static Code Analysis ---");
    const authContextPath = path.join(process.cwd(), 'context/auth-context.tsx');
    const authContextSource = fs.readFileSync(authContextPath, 'utf8');
    // Test: Password never appears in localStorage
    assert(!authContextSource.includes('password: u.password') && !authContextSource.includes('expectedPassword'), "Password never appears in local fallback storage", "Local fallback auth containing password storage was found.");
    // Test: Password never appears in updateProfile payload
    assert(!authContextSource.includes('password: newPassword'), "Password is never updated via client updateProfile", "Password update found in updateProfile payload.");
    // Test: Role escalation attempt (role removed from updateProfile)
    assert(!authContextSource.includes('role: updatedUser.role'), "Role escalation protection (role stripped from client payload)", "Role field found in updateProfile payload.");
    const jwtUtilPath = path.join(process.cwd(), 'lib/jwt.ts');
    const jwtUtilSource = fs.readFileSync(jwtUtilPath, 'utf8');
    // Test: JWT secret fails hard in production
    assert(jwtUtilSource.includes("throw new Error('FATAL: JWT_SECRET environment variable is not set"), "JWT Production Secret requires explicit configuration", "JWT secret hard failure is missing.");
    // 2. Dynamic API Tests (Assuming server is running on localhost:3000)
    console.log("\n--- Phase 2: Dynamic API & Integration Tests ---");
    console.log("Note: Server must be running on localhost:3000 for these to execute correctly.");
    try {
        // Wait for server if it's slow
        await fetch('http://localhost:3001/', { method: 'HEAD' });
        // Test: Unauthenticated admin request -> 401
        const adminResNoAuth = await fetch(`${API_BASE}/admin/delete-user`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId: 'test-123' })
        });
        assert(adminResNoAuth.status === 401, "Unauthenticated admin request returns 401 Unauthorized", `Expected 401, got ${adminResNoAuth.status}`);
        // Test: Invalid JWT -> 401
        const adminResInvalidAuth = await fetch(`${API_BASE}/admin/delete-user`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer invalid_jwt_token_here' },
            body: JSON.stringify({ userId: 'test-123' })
        });
        assert(adminResInvalidAuth.status === 401, "Invalid JWT in admin request returns 401 Unauthorized", `Expected 401, got ${adminResInvalidAuth.status}`);
        // Test: Moodle SSRF protections
        const ssrfUrl = 'http://169.254.169.254/latest/meta-data/'; // AWS Metadata IP
        const moodleRes = await fetch(`${API_BASE}/moodle-proxy?url=${encodeURIComponent(ssrfUrl)}`);
        assert(moodleRes.status === 403, "Moodle Proxy blocks SSRF attempts to private IP ranges (169.254.x.x)", `Expected 403, got ${moodleRes.status}`);
        // Test: Rate limit behavior (Moodle Proxy)
        let rateLimited = false;
        // We send 25 requests (limit is 20)
        for (let i = 0; i < 25; i++) {
            const res = await fetch(`${API_BASE}/moodle-proxy?url=${encodeURIComponent('https://moodle.su.edu.eg')}`);
            if (res.status === 429) {
                rateLimited = true;
                break;
            }
        }
        assert(rateLimited, "Rate Limiter triggers 429 on abuse (Moodle Proxy)", "Rate limit did not trigger after 25 requests.");
        // Test: Security Headers / CSP presence
        const pageRes = await fetch('http://localhost:3001/');
        const csp = pageRes.headers.get('content-security-policy');
        const nosniff = pageRes.headers.get('x-content-type-options');
        assert(csp !== null && csp.includes("default-src 'self'"), "Content-Security-Policy header is present and configured", "CSP header is missing or incorrect.");
        assert(nosniff === 'nosniff', "X-Content-Type-Options: nosniff header is present", "Header is missing.");
    }
    catch (error) {
        console.error("⚠️ Failed to execute dynamic tests. Ensure 'npm run dev' is running on port 3000.");
        console.error(error.message);
    }
    console.log("\n=========================================");
    console.log(`Test Summary: ${passed} Passed | ${failed} Failed`);
    console.log("=========================================\n");
    if (failed > 0)
        process.exit(1);
}
runTests();
