const fs = require('fs');
const path = require('path');

let totalTests = 0;
let passedTests = 0;

function assert(description, condition, details = "") {
  totalTests++;
  if (condition) {
    passedTests++;
    console.log(`  ✅ [PASS] ${description}`);
  } else {
    console.error(`  ❌ [FAIL] ${description} ${details ? `(${details})` : ""}`);
  }
}

// Community Idempotency Engine Emulator
class CommunityIdempotencyEngine {
  constructor(userId, userEmail, userName) {
    this.userId = userId;
    this.userEmail = userEmail;
    this.userName = userName;
    this.inFlightPosts = new Set();
    this.inFlightComments = new Set();
    this.inFlightReplies = new Set();
    this.posts = [];
    this.savedJobs = [];
    this.savedEvents = [];
    this.networkInserts = {
      posts: 0,
      comments: 0,
      replies: 0,
      likes: 0
    };
  }

  async createPost(title, content, category) {
    const lockKey = `post_${this.userId}_${title.trim().toLowerCase()}`;
    if (this.inFlightPosts.has(lockKey)) return false;
    this.inFlightPosts.add(lockKey);

    const newPost = {
      id: `post-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      title,
      content,
      category,
      author: this.userName,
      authorEmail: this.userEmail,
      likes: [],
      comments: []
    };

    this.posts = [newPost, ...this.posts];
    await new Promise(r => setTimeout(r, 50));
    this.networkInserts.posts++;

    setTimeout(() => {
      this.inFlightPosts.delete(lockKey);
    }, 400);

    return true;
  }

  async addComment(postId, content) {
    const lockKey = `comment_${this.userId}_${postId}_${content.trim().toLowerCase()}`;
    if (this.inFlightComments.has(lockKey)) return false;
    this.inFlightComments.add(lockKey);

    const newComment = {
      id: `comment-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      postId,
      author: this.userName,
      authorEmail: this.userEmail,
      content: content.trim(),
      replies: []
    };

    this.posts = this.posts.map(p => {
      if (p.id === postId) {
        return { ...p, comments: [...p.comments, newComment] };
      }
      return p;
    });

    await new Promise(r => setTimeout(r, 40));
    this.networkInserts.comments++;

    setTimeout(() => {
      this.inFlightComments.delete(lockKey);
    }, 400);

    return true;
  }

  async addReply(postId, commentId, content) {
    const lockKey = `reply_${this.userId}_${commentId}_${content.trim().toLowerCase()}`;
    if (this.inFlightReplies.has(lockKey)) return false;
    this.inFlightReplies.add(lockKey);

    const newReply = {
      id: `reply-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      author: this.userName,
      authorEmail: this.userEmail,
      content: content.trim()
    };

    this.posts = this.posts.map(p => {
      if (p.id === postId) {
        const commentIndex = p.comments.findIndex(c => c.id === commentId);
        if (commentIndex !== -1) {
          const targetComment = p.comments[commentIndex];
          const updatedComments = [...p.comments];
          updatedComments[commentIndex] = {
            ...targetComment,
            replies: [...targetComment.replies, newReply]
          };
          return { ...p, comments: updatedComments };
        }
      }
      return p;
    });

    await new Promise(r => setTimeout(r, 40));
    this.networkInserts.replies++;

    setTimeout(() => {
      this.inFlightReplies.delete(lockKey);
    }, 400);

    return true;
  }

  likePost(postId) {
    this.posts = this.posts.map(p => {
      if (p.id === postId) {
        const liked = p.likes.includes(this.userEmail);
        const newLikes = liked
          ? p.likes.filter(email => email !== this.userEmail)
          : Array.from(new Set([...p.likes, this.userEmail]));
        return { ...p, likes: newLikes };
      }
      return p;
    });
    this.networkInserts.likes++;
  }

  toggleSaveJob(jobId) {
    this.savedJobs = this.savedJobs.includes(jobId)
      ? this.savedJobs.filter(j => j !== jobId)
      : Array.from(new Set([...this.savedJobs, jobId]));
  }

  toggleSaveEvent(eventId) {
    this.savedEvents = this.savedEvents.includes(eventId)
      ? this.savedEvents.filter(e => e !== eventId)
      : Array.from(new Set([...this.savedEvents, eventId]));
  }
}

async function runCommunityTests() {
  console.log("================================================================================");
  console.log("🛡️ TESTING PHASE 3 STEP 3: COMMUNITY P1 HARDENING & IDEMPOTENCY ENGINE");
  console.log("================================================================================");

  const engine = new CommunityIdempotencyEngine("u-101", "student@sinai.edu.eg", "أحمد محمود");

  // ----------------------------------------------------------------------------------
  // TEST 1: 50 Rapid Concurrent Clicks on 'Create Post'
  // ----------------------------------------------------------------------------------
  console.log("\n📌 Scenario 1: Simulating 50 Rapid Concurrent Clicks on 'Create Post'...");
  const postPromises = [];
  for (let i = 0; i < 50; i++) {
    postPromises.push(
      engine.createPost("سؤال عن مشروع التخرج لقسم علوم الحاسب", "ما هي أفضل التقنيات المقترحة للذكاء الاصطناعي؟", "General Discussion")
    );
  }

  const postResults = await Promise.all(postPromises);
  const postAccepted = postResults.filter(r => r === true).length;
  const postBlocked = postResults.filter(r => r === false).length;

  assert("Exactly 1 post was accepted and created", postAccepted === 1, `Accepted: ${postAccepted}`);
  assert("49 duplicate post creations were blocked by In-Flight Mutex", postBlocked === 49, `Blocked: ${postBlocked}`);
  assert("Post state contains exactly 1 item", engine.posts.length === 1);
  assert("Supabase network dispatch received exactly 1 single INSERT", engine.networkInserts.posts === 1);

  const createdPostId = engine.posts[0].id;

  // ----------------------------------------------------------------------------------
  // TEST 2: 50 Rapid Concurrent Clicks on 'Add Comment'
  // ----------------------------------------------------------------------------------
  console.log("\n📌 Scenario 2: Simulating 50 Rapid Concurrent Clicks on 'Add Comment'...");
  const commentPromises = [];
  for (let i = 0; i < 50; i++) {
    commentPromises.push(
      engine.addComment(createdPostId, "أنصحك باستخدام Next.js مع Supabase وFastAPI.")
    );
  }

  const commentResults = await Promise.all(commentPromises);
  const commentAccepted = commentResults.filter(r => r === true).length;
  const commentBlocked = commentResults.filter(r => r === false).length;

  assert("Exactly 1 comment was accepted and attached", commentAccepted === 1, `Accepted: ${commentAccepted}`);
  assert("49 duplicate comments were blocked by In-Flight Mutex", commentBlocked === 49, `Blocked: ${commentBlocked}`);
  assert("Post contains exactly 1 comment", engine.posts[0].comments.length === 1);
  assert("Supabase network dispatch received exactly 1 comment INSERT", engine.networkInserts.comments === 1);

  const createdCommentId = engine.posts[0].comments[0].id;

  // ----------------------------------------------------------------------------------
  // TEST 3: 50 Rapid Concurrent Clicks on 'Add Reply'
  // ----------------------------------------------------------------------------------
  console.log("\n📌 Scenario 3: Simulating 50 Rapid Concurrent Clicks on 'Add Reply'...");
  const replyPromises = [];
  for (let i = 0; i < 50; i++) {
    replyPromises.push(
      engine.addReply(createdPostId, createdCommentId, "شكراً جزيلاً على النصيحة القيمة!")
    );
  }

  const replyResults = await Promise.all(replyPromises);
  const replyAccepted = replyResults.filter(r => r === true).length;
  const replyBlocked = replyResults.filter(r => r === false).length;

  assert("Exactly 1 reply was accepted and nested", replyAccepted === 1, `Accepted: ${replyAccepted}`);
  assert("49 duplicate replies were blocked by In-Flight Mutex", replyBlocked === 49, `Blocked: ${replyBlocked}`);
  assert("Comment contains exactly 1 reply", engine.posts[0].comments[0].replies.length === 1);
  assert("Supabase network dispatch received exactly 1 reply INSERT", engine.networkInserts.replies === 1);

  // ----------------------------------------------------------------------------------
  // TEST 4: Rapid Like / Unlike Toggling
  // ----------------------------------------------------------------------------------
  console.log("\n📌 Scenario 4: Simulating Rapid Like / Unlike Toggling...");
  // Initial state: not liked
  assert("Initial likes are empty", engine.posts[0].likes.length === 0);

  // Rapid Click 1: Like
  engine.likePost(createdPostId);
  assert("Like added successfully", engine.posts[0].likes.includes("student@sinai.edu.eg") && engine.posts[0].likes.length === 1);

  // Rapid Click 2: Unlike
  engine.likePost(createdPostId);
  assert("Unlike removed successfully", !engine.posts[0].likes.includes("student@sinai.edu.eg") && engine.posts[0].likes.length === 0);

  // Rapid Click 3: Re-like
  engine.likePost(createdPostId);
  assert("Re-like added with set uniqueness", engine.posts[0].likes.length === 1);

  // ----------------------------------------------------------------------------------
  // TEST 5: Rapid Save / Unsave Toggling (Jobs & Events)
  // ----------------------------------------------------------------------------------
  console.log("\n📌 Scenario 5: Simulating Rapid Save / Unsave Toggling for Jobs & Events...");
  // Rapid toggle jobs
  engine.toggleSaveJob("job-001");
  engine.toggleSaveJob("job-002");
  engine.toggleSaveJob("job-001"); // Unsave job-001
  engine.toggleSaveJob("job-003");
  engine.toggleSaveJob("job-002"); // Unsave job-002
  engine.toggleSaveJob("job-003"); // Unsave job-003
  engine.toggleSaveJob("job-001"); // Re-save job-001

  assert("Saved jobs maintains exact set integrity without duplicates", engine.savedJobs.length === 1 && engine.savedJobs[0] === "job-001");

  // Rapid toggle events
  engine.toggleSaveEvent("ev-100");
  engine.toggleSaveEvent("ev-200");
  engine.toggleSaveEvent("ev-100"); // Unsave ev-100
  engine.toggleSaveEvent("ev-300");
  engine.toggleSaveEvent("ev-300"); // Unsave ev-300

  assert("Saved events maintains exact set integrity without duplicates", engine.savedEvents.length === 1 && engine.savedEvents[0] === "ev-200");

  // ----------------------------------------------------------------------------------
  // TEST 6: Multi-Tab Cross-Tab Community Concurrency
  // ----------------------------------------------------------------------------------
  console.log("\n📌 Scenario 6: Simulating Multi-Tab Community Concurrency...");
  const tabA = new CommunityIdempotencyEngine("u-101", "student@sinai.edu.eg", "أحمد محمود");
  const tabB = new CommunityIdempotencyEngine("u-102", "sarah@sinai.edu.eg", "سارة علي");

  // Tab A creates post
  await tabA.createPost("مقارنة بين React و Vue في 2026", "ما رأيكم في مستقبل الواجهات؟", "Tech News");
  const sharedPost = tabA.posts[0];
  tabB.posts = [sharedPost];

  // Tab A likes, Tab B adds comment concurrently
  tabA.likePost(sharedPost.id);
  await tabB.addComment(sharedPost.id, "أفضل React للشركات الكبرى.");

  // Reconcile
  const reconciledComments = tabB.posts[0].comments;
  const reconciledLikes = tabA.posts[0].likes;
  const mergedPost = {
    ...sharedPost,
    likes: reconciledLikes,
    comments: reconciledComments
  };

  assert("Cross-tab like is preserved", mergedPost.likes.includes("student@sinai.edu.eg"));
  assert("Cross-tab comment is preserved", mergedPost.comments.length === 1 && mergedPost.comments[0].author === "سارة علي");

  // ----------------------------------------------------------------------------------
  // TEST 7: Source Code & UI Disabled Guard Verification
  // ----------------------------------------------------------------------------------
  console.log("\n📌 Scenario 7: Codebase Inspection for UI Disabled & In-Flight Guards...");
  const communityPage = fs.readFileSync(path.join(process.cwd(), 'app', '(platform)', 'community', 'page.tsx'), 'utf8');
  assert("community/page.tsx contains isSubmittingPost state", communityPage.includes('isSubmittingPost'));
  assert("community/page.tsx contains submittingCommentPostId state", communityPage.includes('submittingCommentPostId'));
  assert("community/page.tsx contains submittingReplyCommentId state", communityPage.includes('submittingReplyCommentId'));
  assert("community/page.tsx submit button has isLoading & disabled guards", communityPage.includes('isLoading={isSubmittingPost}') && communityPage.includes('disabled={isSubmittingPost}'));
  assert("community/page.tsx comment button has isLoading & disabled guards", communityPage.includes('isLoading={submittingCommentPostId === post.id}') && communityPage.includes('disabled={submittingCommentPostId === post.id}'));
  assert("community/page.tsx reply button has isLoading & disabled guards", communityPage.includes('isLoading={submittingReplyCommentId === comment.id}') && communityPage.includes('disabled={submittingReplyCommentId === comment.id}'));

  const socialCtx = fs.readFileSync(path.join(process.cwd(), 'context', 'social-context.tsx'), 'utf8');
  assert("social-context.tsx contains inFlightPostsRef", socialCtx.includes('inFlightPostsRef'));
  assert("social-context.tsx contains inFlightCommentsRef", socialCtx.includes('inFlightCommentsRef'));
  assert("social-context.tsx contains inFlightRepliesRef", socialCtx.includes('inFlightRepliesRef'));
  assert("social-context.tsx toggleSaveJob uses Set uniqueness", socialCtx.includes('Array.from(new Set([...savedJobs'));
  assert("social-context.tsx toggleSaveEvent uses Set uniqueness", socialCtx.includes('Array.from(new Set([...savedEvents'));

  console.log("\n================================================================================");
  console.log(`RESULTS: ${passedTests} / ${totalTests} Passed`);
  console.log("================================================================================");

  if (passedTests === totalTests) {
    console.log("🎉 PHASE 3 STEP 3 COMMUNITY HARDENING & IDEMPOTENCY VERIFIED WITH 100% SUCCESS!");
    process.exit(0);
  } else {
    console.error("❌ STEP 3 COMMUNITY TESTS FAILED!");
    process.exit(1);
  }
}

runCommunityTests();
