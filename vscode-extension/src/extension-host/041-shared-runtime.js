var U$t,
  gi = g(() => {
    O();
    $();
    Tr();
    Yr();
    U$t = d.object({ avatar_url: d.string().nullable().optional(), login: d.string() });
  });
async function G$t(t, e, r) {
  let n = await I(t, ["log", "-1", "--pretty=%s"], e, { signal: r }),
    o = await I(t, ["log", "-1", "--pretty=%b"], e, { signal: r });
  return { title: n.success ? n.stdout.trim() : "", body: o.success ? o.stdout.trim() : "" };
}
async function SUe(
  {
    cwd: t,
    headBranch: e,
    baseBranch: r,
    isDraft: n = !1,
    openInBrowser: o = !1,
    titleOverride: i,
    bodyOverride: s,
  },
  a,
  l,
  c,
) {
  try {
    let u = t?.trim();
    if (!u) return { status: "error", error: "No workspace available for PR creation" };
    await Cn(l, c);
    let m = (await a.getWorktreeRepository(u, l))?.root;
    if (!m) return { status: "error", error: "No git repository found for PR creation" };
    let f = e.trim();
    if (!f) return { status: "error", error: "Head branch is required" };
    let h = null,
      v = async () => (h != null || (h = await G$t(m, l, c)), h),
      y = i ?? "",
      w = s ?? "";
    if (y.length === 0) {
      let _ = await v(),
        S = _.title.trim();
      if (((y = S.length > 0 ? S : f), w.length === 0)) {
        let E = _.body.trim();
        E.length > 0 && (w = E);
      }
    }
    return (
      w.length === 0 && (w = (await v()).body.trim()),
      await W$t({
        gitRoot: m,
        appServerClient: l,
        headBranch: f,
        baseBranch: r,
        isDraft: n,
        openInBrowser: o,
        title: y,
        body: w,
        signal: c,
      })
    );
  } catch (u) {
    return { status: "error", error: u instanceof Error ? u.message : String(u) };
  }
}
async function W$t({
  gitRoot: t,
  appServerClient: e,
  headBranch: r,
  baseBranch: n,
  isDraft: o,
  openInBrowser: i,
  title: s,
  body: a,
  signal: l,
}) {
  let c = i && tn(e.hostConfig),
    u = await Le(
      H$t({ baseBranch: n, body: a, headBranch: r, isDraft: o, openInBrowser: i, title: s }),
      {
        cwd: t,
        appServerClient: e,
        ...(c ? { env: { GH_BROWSER: "echo" } } : {}),
        signal: l,
        timeoutMs: 15e3,
      },
    );
  if (!u.success)
    return $r(u, i ? "Failed to open pull request in browser" : "Failed to create pull request");
  if (i) {
    let f = c ? j$t(u.stdout) : null;
    return c && f == null
      ? { status: "error", error: "Failed to capture pull request browser URL" }
      : { status: "success", url: f, number: null };
  }
  let p = `${u.stdout}
${u.stderr}`.trim(),
    m = p ? vUe(p) : null;
  return { status: "success", url: m, number: bUe(m) };
}
function H$t({ baseBranch: t, body: e, headBranch: r, isDraft: n, openInBrowser: o, title: i }) {
  let s = ["pr", "create"];
  (o && s.push("--web"), s.push("--head", r, "--title", i));
  let a = t?.trim();
  return (a && s.push("--base", a), n && !o && s.push("--draft"), s.push("--body", e), s);
}
function j$t(t) {
  return /https?:\/\/\S+/.exec(t)?.[0] ?? null;
}
var t8 = g(() => {
  ul();
  O();
  gi();
  Tr();
  Yr();
});
async function of({
  appServerClient: t,
  cwd: e,
  failureMessage: r = "Failed to find pull request head commit",
  number: n,
  repo: o,
}) {
  let i = ["pr", "view", String(n), "--json", "headRefOid", "--jq", ".headRefOid"];
  o != null && i.push("--repo", o);
  let s = await Le(i, { appServerClient: t, cwd: e, timeoutMs: 5e3 });
  if (!s.success) return $r(s, r);
  let a = s.stdout.trim();
  return a.length === 0
    ? { status: "error", error: "GitHub returned an empty pull request head revision" }
    : { status: "success", headRevision: a };
}
var FN = g(() => {
  Tr();
  Yr();
});
var z$t,
  wUe,
  _Ue,
  yv,
  xUe,
  AUe,
  RUe,
  BA,
  V$t,
  K$t,
  Z$t,
  X$t,
  Y$t,
  J$t,
  EUe,
  r8,
  CUe,
  TUe,
  Q$t,
  PUe,
  Qs,
  eUt,
  tUt,
  n8,
  rUt,
  IUe,
  o8,
  kUe,
  vd = g(() => {
    $();
    ((z$t = d.object({
      headRefName: d.string(),
      state: d.string().optional(),
      number: d.number().optional(),
      url: d.string().optional(),
    })),
      (wUe = d.array(z$t)),
      (_Ue = d.discriminatedUnion("__typename", [
        d.object({
          __typename: d.literal("Team"),
          name: d.string().optional(),
          slug: d.string().optional(),
        }),
        d.object({ __typename: d.literal("User"), login: d.string().optional() }),
      ])),
      (yv = d.object({
        __typename: d.string().optional(),
        avatarUrl: d.string().optional().nullable(),
        login: d.string().optional().nullable(),
      })),
      (xUe = d.object({
        author: yv.optional().nullable(),
        comments: d.object({ totalCount: d.number().optional() }).optional().nullable(),
        state: d.string().optional().nullable(),
      })),
      (AUe = d.object({
        author: yv.optional().nullable(),
        body: d.string().optional().nullable(),
        isMinimized: d.boolean().optional(),
        viewerCanDelete: d.boolean().optional(),
        viewerCanUpdate: d.boolean().optional(),
      })),
      (RUe = AUe.extend({
        pullRequestReview: d.object({ id: d.string() }).nullish(),
        state: d.string().optional(),
        bodyHTML: d.string().optional().nullable(),
        createdAt: d.string().optional(),
        diffHunk: d.string().optional().nullable(),
        id: d.string().optional(),
        url: d.string().optional().nullable(),
      })),
      (BA = d.object({
        startCursor: d.string().optional().nullable(),
        hasPreviousPage: d.boolean().optional(),
        endCursor: d.string().optional().nullable(),
        hasNextPage: d.boolean().optional(),
      })),
      (V$t = d.object({
        comments: d
          .object({ nodes: d.array(RUe).optional(), pageInfo: BA.optional() })
          .optional()
          .nullable(),
        diffSide: d.enum(["LEFT", "RIGHT"]).optional().nullable(),
        id: d.string().optional(),
        isResolved: d.boolean().optional(),
        line: d.number().optional().nullable(),
        originalLine: d.number().optional().nullable(),
        originalStartLine: d.number().optional().nullable(),
        path: d.string().optional().nullable(),
        startLine: d.number().optional().nullable(),
        startDiffSide: d.enum(["LEFT", "RIGHT"]).optional().nullable(),
        viewerCanResolve: d.boolean().optional(),
        viewerCanUnresolve: d.boolean().optional(),
      })),
      (K$t = d.object({ nodes: d.array(V$t).optional(), pageInfo: BA.optional() })),
      (Z$t = d.object({
        event: d.string().optional().nullable(),
        completedAt: d.string().optional().nullable(),
        detailsUrl: d.string().optional().nullable(),
        conclusion: d.string().optional().nullable(),
        name: d.string(),
        startedAt: d.string(),
        status: d.string().optional().nullable(),
        workflowName: d.string().optional().nullable(),
      })),
      (X$t = d.object({
        description: d.string().optional().nullable(),
        targetUrl: d.string().optional().nullable(),
        context: d.string(),
        createdAt: d.string(),
        state: d.string().optional().nullable(),
      })),
      (Y$t = d.union([Z$t, X$t])),
      (J$t = d.object({
        additions: d.number(),
        baseRefName: d.string(),
        createdAt: d.string(),
        deletions: d.number(),
        headRefName: d.string(),
        isDraft: d.boolean(),
        latestReviews: d.array(xUe).optional(),
        mergeStateStatus: d.string().optional().nullable(),
        mergeable: d.string().optional().nullable(),
        number: d.number(),
        reviewDecision: d.string().optional().nullable(),
        reviewRequests: d.array(_Ue).optional(),
        state: d.string(),
        statusCheckRollup: d.array(Y$t).optional(),
        title: d.string(),
        updatedAt: d.string(),
        url: d.string(),
      })),
      (EUe = d.array(J$t)),
      (r8 = AUe.extend({
        createdAt: d.string().optional(),
        id: d.string().optional(),
        url: d.string().optional().nullable(),
      })),
      (CUe = d.object({
        login: d.string().optional().nullable(),
        name: d.string().optional().nullable(),
        user: yv.optional().nullable(),
      })),
      (TUe = d.object({
        authors: d.array(CUe).optional(),
        committedDate: d.string().optional(),
        messageHeadline: d.string().optional(),
        oid: d.string().optional(),
        url: d.string().optional().nullable(),
      })),
      (Q$t = r8.extend({
        diffHunk: d.string().optional().nullable(),
        line: d.number().optional().nullable(),
        path: d.string().optional().nullable(),
        startLine: d.number().optional().nullable(),
      })),
      (PUe = r8.extend({
        comments: d.array(Q$t).optional(),
        state: d.string().optional().nullable(),
        submittedAt: d.string().optional().nullable(),
      })),
      (Qs = d.object({
        additions: d.number().optional(),
        allowedMergeMethods: d.array(d.enum(["merge", "squash"])).optional(),
        author: yv.optional().nullable(),
        autoMergeRequest: d.unknown().optional().nullable(),
        baseRefName: d.string().optional(),
        body: d.string().optional(),
        comments: d.array(r8).optional(),
        commits: d.array(TUe).optional(),
        createdAt: d.string().optional(),
        deletions: d.number().optional(),
        headRefName: d.string().optional(),
        headRefOid: d.string().optional(),
        headRepository: d.object({ name: d.string() }).nullish(),
        headRepositoryOwner: d.object({ login: d.string() }).nullish(),
        isDraft: d.boolean().optional(),
        latestReviews: d.array(xUe).optional(),
        mergedAt: d.string().optional().nullable(),
        mergedBy: yv.optional().nullable(),
        mergeStateStatus: d.string().optional().nullable(),
        mergeable: d.string().optional().nullable(),
        number: d.number().optional(),
        reviewRequests: d.array(_Ue).optional(),
        reviewDecision: d.string().optional().nullable(),
        reviews: d.array(PUe).optional(),
        state: d.string().optional(),
        title: d.string().optional(),
        updatedAt: d.string().optional(),
        url: d.string().optional(),
      })),
      (eUt = d.object({
        __typename: d.literal("CheckRun"),
        completedAt: d.string().optional().nullable(),
        detailsUrl: d.string().optional().nullable(),
        checkSuite: d
          .object({
            workflowRun: d
              .object({
                event: d.string().optional().nullable(),
                workflow: d.object({ name: d.string() }).optional().nullable(),
              })
              .optional()
              .nullable(),
          })
          .optional()
          .nullable(),
        conclusion: d.string().optional().nullable(),
        name: d.string(),
        startedAt: d.string().nullable(),
        status: d.string().optional().nullable(),
      })),
      (tUt = d.object({
        __typename: d.literal("StatusContext"),
        description: d.string().optional().nullable(),
        targetUrl: d.string().optional().nullable(),
        context: d.string(),
        createdAt: d.string(),
        state: d.string().optional().nullable(),
      })),
      (n8 = d.union([eUt, tUt])),
      (rUt = d.object({
        __typename: d.literal("PullRequest"),
        additions: d.number(),
        author: yv.optional().nullable(),
        baseRefName: d.string(),
        createdAt: d.string(),
        deletions: d.number(),
        headRefName: d.string(),
        id: d.string(),
        isDraft: d.boolean(),
        mergeStateStatus: d.string().optional().nullable(),
        mergeable: d.string().optional().nullable(),
        number: d.number().int().positive(),
        repository: d.object({ name: d.string(), owner: d.object({ login: d.string() }) }),
        state: d.enum(["OPEN", "CLOSED", "MERGED"]),
        statusCheckRollup: d
          .object({
            contexts: d.object({
              nodes: d.array(n8.nullable()),
              totalCount: d.number().int().nonnegative(),
            }),
          })
          .optional()
          .nullable(),
        title: d.string(),
        updatedAt: d.string(),
        url: d.string(),
      })),
      (IUe = d.object({
        data: d.object({
          search: d.object({
            issueCount: d.number().int().nonnegative(),
            nodes: d.array(rUt.nullable()),
            pageInfo: d.object({ endCursor: d.string().nullable(), hasNextPage: d.boolean() }),
          }),
        }),
      })),
      (o8 = d.object({
        id: d.string(),
        body: d.string(),
        state: d.literal("PENDING"),
        author: d.object({ login: d.string() }),
        commit: d.object({ oid: d.string() }).nullable(),
        comments: d.object({ totalCount: d.number() }),
      })),
      (kUe = d.object({
        data: d.object({
          viewer: d.object({ login: d.string() }),
          repository: d
            .object({
              pullRequest: d
                .object({
                  headRefOid: d.string(),
                  baseRefOid: d.string(),
                  pendingReviews: d.object({ nodes: d.array(o8) }).optional(),
                  createdAt: Qs.shape.createdAt,
                  author: Qs.shape.author,
                  number: Qs.shape.number,
                  url: Qs.shape.url,
                  mergedAt: Qs.shape.mergedAt,
                  mergedBy: Qs.shape.mergedBy,
                  commits: d
                    .object({
                      nodes: d.array(
                        d.object({
                          commit: TUe.extend({
                            authors: d.object({ nodes: d.array(CUe) }).optional(),
                          }),
                        }),
                      ),
                      pageInfo: BA,
                    })
                    .optional(),
                  comments: d
                    .object({ nodes: d.array(RUe).optional(), pageInfo: BA.optional() })
                    .optional()
                    .nullable(),
                  reviews: d
                    .object({ nodes: d.array(PUe).optional(), pageInfo: BA.optional() })
                    .optional()
                    .nullable(),
                  reviewThreads: K$t.optional().nullable(),
                })
                .optional()
                .nullable(),
            })
            .optional()
            .nullable(),
        }),
      })));
  });
async function DUe(t, e) {
  if (!t.expectedHeadRevision?.trim())
    throw new Error("Pending comments require a reviewed diff and head revision");
  let { pullRequestId: r, pending: n } = await i8(t, e, t.expectedHeadRevision);
  if (t.review === "pending" && t.pendingReviewId != null && n?.id !== t.pendingReviewId)
    throw new Error("Pending review changed or was submitted; refresh before continuing");
  if (t.replyToReviewThreadId != null && t.review === "pending") {
    if (
      ur(
        await sf(
          t,
          e,
          "query($id:ID!){node(id:$id){... on PullRequestReviewThread{pullRequest{id}}}}",
          { id: t.replyToReviewThreadId },
        ),
        d.object({
          data: d.object({
            node: d.object({ pullRequest: d.object({ id: d.string() }) }).nullable(),
          }),
        }),
      ).data.node?.pullRequest.id !== r
    )
      throw new Error("Thread does not belong to this pull request");
    await sf(
      t,
      e,
      "mutation($id:ID!,$review:ID!,$body:String!){addPullRequestReviewThreadReply(input:{pullRequestReviewThreadId:$id,pullRequestReviewId:$review,body:$body}){comment{id}}}",
      { id: t.replyToReviewThreadId, review: t.pendingReviewId, body: t.body.trim() },
    );
    return;
  }
  let o = t.inlineComment;
  if (o == null) throw new Error("Pending comments require a reviewed diff or a thread reply");
  let i = "body:$body,path:$path,line:$line,side:$side,startLine:$startLine,startSide:$startSide",
    s =
      "$id:ID!,$body:String!,$path:String!,$line:Int!,$side:DiffSide!,$startLine:Int,$startSide:DiffSide",
    a =
      n == null
        ? `mutation(${s},$commit:GitObjectID!){addPullRequestReview(input:{pullRequestId:$id,commitOID:$commit,threads:[{${i}}]}){pullRequestReview{id}}}`
        : `mutation(${s}){addPullRequestReviewThread(input:{pullRequestReviewId:$id,${i}}){thread{id}}}`;
  await sf(t, e, a, {
    id: n?.id ?? r,
    body: t.body.trim(),
    path: o.path,
    line: o.line,
    side: o.side.toUpperCase(),
    commit: n == null ? t.expectedHeadRevision : void 0,
    startLine: o.startLine,
    startSide: o.startSide?.toUpperCase(),
  });
}
async function MUe(t, e) {
  let { pending: r } = await i8(t, e, t.expectedHeadRevision);
  if (r == null || r.id !== t.pendingReviewId)
    throw new Error("Pending review changed or was submitted; refresh before continuing");
  let n = t.body?.trim() ?? "";
  if (!n && t.event !== "approve" && (t.event !== "comment" || r.comments.totalCount === 0))
    throw new Error("Review body is required");
  await sf(
    t,
    e,
    "mutation($id:ID!,$body:String!,$event:PullRequestReviewEvent!){submitPullRequestReview(input:{pullRequestReviewId:$id,body:$body,event:$event}){pullRequestReview{id}}}",
    { id: r.id, body: n, event: t.event.toUpperCase() },
  );
}
async function OUe(t, e) {
  let { pending: r } = await i8(t, e, null);
  if (r == null || r.id !== t.nodeId)
    throw new Error("Pending review changed or was submitted; refresh before continuing");
  await sf(
    t,
    e,
    "mutation($id:ID!){deletePullRequestReview(input:{pullRequestReviewId:$id}){clientMutationId}}",
    { id: r.id },
  );
}
async function NUe(t, e) {
  let { data: r } = ur(
      await sf(
        t,
        e,
        "query($id:ID!){viewer{login} node(id:$id){... on PullRequestReviewComment{state author{login} pullRequest{number repository{name owner{login}}} pullRequestReview{id state author{login}}}}}",
        { id: t.nodeId },
      ),
      d.object({
        data: d.object({
          viewer: d.object({ login: d.string() }),
          node: d
            .object({
              state: d.string(),
              author: d.object({ login: d.string() }).nullable(),
              pullRequest: d.object({
                number: d.number(),
                repository: d.object({ name: d.string(), owner: d.object({ login: d.string() }) }),
              }),
              pullRequestReview: d
                .object({
                  id: d.string(),
                  state: d.string(),
                  author: d.object({ login: d.string() }).nullable(),
                })
                .nullable(),
            })
            .nullable(),
        }),
      }),
    ),
    n = r.node,
    o = n?.pullRequestReview,
    i = r.viewer.login.toLowerCase();
  if (
    t.commentType !== "review_comment" ||
    n?.state !== "PENDING" ||
    o?.state !== "PENDING" ||
    o.id !== t.pendingReviewId ||
    i !== t.account.login.toLowerCase() ||
    n.author?.login.toLowerCase() !== i ||
    o.author?.login.toLowerCase() !== i ||
    n.pullRequest.number !== t.pullRequest.number ||
    n.pullRequest.repository.name.toLowerCase() !== t.pullRequest.repository.toLowerCase() ||
    n.pullRequest.repository.owner.login.toLowerCase() !== t.pullRequest.owner.toLowerCase()
  )
    throw new Error("Pending comment changed or was published; refresh before continuing");
}
async function i8(t, e, r) {
  let n = await sf(
      t,
      e,
      "query($owner:String!,$repo:String!,$number:Int!,$login:String!){viewer{login} repository(owner:$owner,name:$repo){pullRequest(number:$number){id headRefOid reviews(first:1,author:$login,states:PENDING){nodes{id body state author{login} commit{oid} comments{totalCount}}}}}}",
      {
        owner: t.pullRequest.owner,
        repo: t.pullRequest.repository,
        number: t.pullRequest.number,
        login: t.account.login,
      },
      5e3,
    ),
    { data: o } = ur(n, nUt),
    i = o.repository?.pullRequest;
  if (o.viewer.login.toLowerCase() !== t.account.login.toLowerCase())
    throw new Error("GitHub account changed; refresh before continuing");
  if (i == null) throw new Error("Pull request not found");
  let s = i.reviews.nodes[0];
  if (
    s != null &&
    (s.state !== "PENDING" || s.author.login.toLowerCase() !== o.viewer.login.toLowerCase())
  )
    throw new Error(
      "Pending review belongs to a different account or revision; review it on GitHub before continuing",
    );
  if (r != null) {
    if (s != null && s.commit?.oid !== i.headRefOid)
      throw new Error(
        s.commit == null
          ? "Pending review revision is unavailable; finish or discard it on GitHub"
          : "New commits were pushed after this review started; finish or discard it on GitHub",
      );
    if (i.headRefOid !== r) throw new Error("Pull request head changed; refresh before continuing");
  }
  return { pullRequestId: i.id, pending: s };
}
async function sf(t, e, r, n, o = 15e3) {
  let i = await Le(
    [
      "api",
      "graphql",
      "--hostname",
      t.pullRequest.hostname,
      "-f",
      `query=${r}`,
      ...Object.entries(n).flatMap(([s, a]) =>
        a === void 0 ? [] : [typeof a == "number" ? "-F" : "-f", `${s}=${a}`],
      ),
    ],
    { appServerClient: e, timeoutMs: o },
  );
  if (!i.success)
    throw new Error(hi(i, "Pending review request failed; refresh before trying again"));
  return i.stdout;
}
var nUt,
  $N = g(() => {
    $();
    vd();
    Tr();
    Yr();
    nUt = d.object({
      data: d.object({
        viewer: d.object({ login: d.string() }),
        repository: d
          .object({
            pullRequest: d
              .object({
                id: d.string(),
                headRefOid: d.string(),
                reviews: d.object({ nodes: d.array(o8) }),
              })
              .nullable(),
          })
          .nullable(),
      }),
    });
  });
function zt(t, e) {
  if (
    t.account.hostId !== e.id ||
    t.account.hostname.toLowerCase() !== t.pullRequest.hostname.toLowerCase()
  )
    throw new RangeError("Pull request account does not match the request");
  return {
    hostname: t.pullRequest.hostname,
    number: t.pullRequest.number,
    repo: `${t.pullRequest.hostname}/${t.pullRequest.owner}/${t.pullRequest.repository}`,
  };
}
var wo = g(() => {});
async function BUe(t, e) {
  try {
    let r = t.body.trim();
    if (r.length === 0) return { status: "error", error: "Comment body is required" };
    let n = zt(t, e);
    return (
      await Cn(e, void 0, n.hostname),
      t.review === "pending"
        ? (await DUe(t, e), { status: "success" })
        : await oUt({
            appServerClient: e,
            body: r,
            expectedHeadRevision: t.expectedHeadRevision,
            inlineComment: t.inlineComment,
            number: n.number,
            replyToReviewThreadId: t.replyToReviewThreadId,
            repo: n.repo,
          })
    );
  } catch (r) {
    return { status: "error", error: r instanceof Error ? r.message : String(r) };
  }
}
async function oUt({
  appServerClient: t,
  body: e,
  expectedHeadRevision: r,
  inlineComment: n,
  number: o,
  replyToReviewThreadId: i,
  repo: s,
}) {
  if (n != null)
    return iUt({
      appServerClient: t,
      body: e,
      expectedHeadRevision: r,
      inlineComment: n,
      number: o,
      repo: s,
    });
  if (i != null) return sUt({ appServerClient: t, body: e, replyToReviewThreadId: i, repo: s });
  let a = await Le(["pr", "comment", String(o), "--body", e, ...(s == null ? [] : ["--repo", s])], {
    appServerClient: t,
    timeoutMs: 15e3,
  });
  return a.success ? { status: "success" } : $r(a, "Failed to post pull request comment");
}
async function iUt({
  appServerClient: t,
  body: e,
  expectedHeadRevision: r,
  inlineComment: n,
  number: o,
  repo: i,
}) {
  let s = Js(i);
  if (s == null || i == null)
    return { status: "error", error: "Repository is required for PR diff comments" };
  let a = r?.trim();
  if (a === "")
    return { status: "error", error: "Expected pull request head revision is required" };
  let l = await of({ appServerClient: t, number: o, repo: i });
  if (l.status === "error") return l;
  if (a != null && l.headRevision !== a)
    return { status: "error", error: "Pull request head changed; refresh before commenting" };
  let c = a ?? l.headRevision,
    u = [
      "api",
      `repos/${s.owner}/${s.repo}/pulls/${o}/comments`,
      "--method",
      "POST",
      "-f",
      `body=${e}`,
      "-f",
      `commit_id=${c}`,
      "-f",
      `path=${n.path}`,
      "-F",
      `line=${n.line}`,
      "-f",
      `side=${LUe(n.side)}`,
    ];
  (n.startLine != null && u.push("-F", `start_line=${n.startLine}`),
    n.startSide != null && u.push("-f", `start_side=${LUe(n.startSide)}`),
    s.hostname != null && u.push("--hostname", s.hostname));
  let p = await Le(u, { appServerClient: t, timeoutMs: 15e3 });
  return p.success ? { status: "success" } : $r(p, "Failed to post pull request diff comment");
}
async function sUt({ appServerClient: t, body: e, replyToReviewThreadId: r, repo: n }) {
  let o = [
      "api",
      "graphql",
      "-f",
      "query=mutation($threadId:ID!,$body:String!){addPullRequestReviewThreadReply(input:{pullRequestReviewThreadId:$threadId,body:$body}){comment{id}}}",
      "-F",
      `threadId=${r}`,
      "-f",
      `body=${e}`,
    ],
    i = Js(n)?.hostname;
  i != null && o.push("--hostname", i);
  let s = await Le(o, { appServerClient: t, timeoutMs: 15e3 });
  return s.success ? { status: "success" } : $r(s, "Failed to reply to pull request comment");
}
function LUe(t) {
  return t === "left" ? "LEFT" : "RIGHT";
}
var s8 = g(() => {
  gi();
  FN();
  Tr();
  Yr();
  $N();
  wo();
});
async function $Ue(t, e, r) {
  try {
    if ("pullRequest" in t) {
      let i = zt(t, r);
      return (
        await Cn(r, void 0, i.hostname),
        await FUe({ appServerClient: r, number: i.number, repo: i.repo })
      );
    }
    await Cn(r);
    let o = (await e.getWorktreeRepository(t.cwd, r))?.root;
    return o == null
      ? { status: "error", error: "No git repository found for pull request diff" }
      : await FUe({ appServerClient: r, gitRoot: o, number: t.number, repo: t.repo });
  } catch (n) {
    return { status: "error", error: n instanceof Error ? n.message : String(n) };
  }
}
async function FUe({ appServerClient: t, gitRoot: e, number: r, repo: n }) {
  for (let o = 0; o < aUt; o += 1) {
    let i = await of({ appServerClient: t, cwd: e, number: r, repo: n });
    if (i.status === "error") return i;
    let s = ["pr", "diff", String(r)];
    n != null && s.push("--repo", n);
    let a = await Le(s, {
      appServerClient: t,
      cwd: e,
      retrySecondaryRateLimit: !0,
      timeoutMs: 15e3,
      trimStdout: !1,
    });
    if (!a.success) return $r(a, "Failed to load pull request diff");
    let l = await of({
      appServerClient: t,
      cwd: e,
      failureMessage: "Failed to verify pull request head commit",
      number: r,
      repo: n,
    });
    if (l.status === "error") return l;
    if (l.headRevision === i.headRevision)
      return { status: "success", headRevision: i.headRevision, unifiedDiff: a.stdout };
  }
  return { status: "error", error: "Pull request head changed during diff acquisition" };
}
var aUt,
  a8 = g(() => {
    O();
    gi();
    FN();
    Tr();
    Yr();
    wo();
    aUt = 2;
  });
var l8,
  UN,
  UUe = g(() => {
    ot();
    Bt();
    ((l8 = class extends ee {
      abortController = new AbortController();
      logger = Dt("github");
      result;
      settled = !1;
      constructor(e) {
        (super(),
          (this.result = e(this.abortController.signal).finally(() => {
            this.settled = !0;
          })),
          this.result.catch((r) => {
            this.abortController.signal.aborted ||
              this.logger.warning("GitHub operation failed", { safe: {}, sensitive: { error: r } });
          }));
      }
      wait() {
        return this.result;
      }
      [Symbol.dispose]() {
        this.settled || this.abortController.abort();
      }
    }),
      (UN = class extends ee {
        constructor(r) {
          super();
          this.handleRequest = r;
        }
        request(r, n, o, i) {
          let s = i?.dup();
          return new l8(async (a) => {
            try {
              return await this.handleRequest(r, n, o, a, s);
            } finally {
              s?.[Symbol.dispose]();
            }
          });
        }
      }));
  });
function vv(t) {
  let e = yu(t);
  return e == null
    ? null
    : e.host === "github.com"
      ? `${e.owner}/${e.repo}`
      : `${e.host}/${e.owner}/${e.repo}`;
}
function qUe(t) {
  if (t == null) return null;
  let e = t.split("/").filter((r) => r.length > 0);
  return e.length < 2 ? null : (e[e.length - 2] ?? null);
}
var c8 = g(() => {
  O();
});
async function GUe({ cwd: t, appServerClient: e, repoArg: r, headBranch: n }) {
  let o = [
    "pr",
    "list",
    "--head",
    n,
    "--author",
    "@me",
    "--state",
    "all",
    "--json",
    "number,url,state,headRefName",
  ];
  r && o.push("--repo", r);
  let i = await Le(o, { cwd: t, appServerClient: e, retrySecondaryRateLimit: !0, timeoutMs: 5e3 });
  if (!i.success) throw new Error(hi(i, "Failed to determine pull request status"));
  let s = n.split(":").at(-1) ?? n,
    a = ur(i.stdout || "[]", wUe).filter((l) => l.headRefName === s);
  return {
    openPullRequest: a.find((l) => l.state?.toUpperCase() === "OPEN") ?? null,
    mergedPullRequest: a.find((l) => l.state?.toUpperCase() === "MERGED") ?? null,
  };
}
var u8 = g(() => {
  vd();
  Tr();
  Yr();
});
async function WUe({ cwd: t, headBranch: e }, r, n) {
  let o = await r.getWorktreeRepository(t, n);
  if (o == null) return null;
  let i = await r.getRepoRepository(t, n),
    [s, a] = await Promise.all([i?.getOriginUrl(), o.getConfigValue("remote.upstream.url")]);
  return (
    (
      await lUt({
        cwd: t,
        appServerClient: n,
        headBranch: e,
        originRepoArg: s ? vv(s) : null,
        upstreamRepoArg: a ? vv(a) : null,
      })
    )?.pullRequest.url ?? null
  );
}
async function lUt({
  cwd: t,
  appServerClient: e,
  headBranch: r,
  originRepoArg: n,
  upstreamRepoArg: o,
}) {
  let i = r.trim();
  if (!i) return null;
  let s = qUe(n),
    a = [];
  (o != null &&
    n != null &&
    o !== n &&
    a.push({ repoArg: o, headBranch: s && !i.includes(":") ? `${s}:${i}` : i }),
    a.push({ repoArg: n, headBranch: i }));
  let l = null;
  for (let c of a) {
    let u = await GUe({ cwd: t, appServerClient: e, ...c });
    if (u.openPullRequest != null) return { pullRequest: u.openPullRequest, repoArg: c.repoArg };
    l == null &&
      u.mergedPullRequest != null &&
      (l = { pullRequest: u.mergedPullRequest, repoArg: c.repoArg });
  }
  return l;
}
var HUe = g(() => {
  c8();
  u8();
});
async function zUe(t, e, r) {
  (zt(t, e), r?.throwIfAborted());
  try {
    let n = t.pullRequest,
      o = await Le(
        [
          "api",
          "graphql",
          "--hostname",
          n.hostname,
          "-f",
          `query=${hUt}`,
          "-f",
          `owner=${n.owner}`,
          "-f",
          `repo=${n.repository}`,
          "-F",
          `number=${n.number}`,
        ],
        { appServerClient: e, signal: r, retrySecondaryRateLimit: !0, timeoutMs: 5e3 },
      );
    if ((r?.throwIfAborted(), !o.success)) return { status: "unavailable" };
    let i = ur(o.stdout, cUt).data;
    if (i.viewer.login.toLowerCase() !== t.account.login.toLowerCase())
      return { status: "unavailable" };
    let s = i.repository?.pullRequest;
    return s == null
      ? { status: "not-found" }
      : { status: "success", body: d8(s.body, s.bodyHTML) };
  } catch {
    return (r?.throwIfAborted(), { status: "unavailable" });
  }
}
function d8(t, e) {
  let r = new Map();
  for (let n of e.matchAll(dUt)) {
    let o = n.groups?.src;
    if (o == null) continue;
    let i = pUt.exec(new URL(o).pathname)?.groups?.assetId;
    i != null && r.set(i, gUt(i, o));
  }
  return t.replace(uUt, (n, o) => r.get(o) ?? n);
}
function gUt(t, e) {
  let r = jUe.get(t);
  return r != null && r.expiresAtMs - mUt > Date.now()
    ? r.src
    : (jUe.set(t, { expiresAtMs: yUt(e), src: e }), e);
}
function yUt(t) {
  let r = new URL(t).searchParams.get("jwt")?.split(".")[1];
  if (!r) return 0;
  try {
    return fUt.parse(JSON.parse(Buffer.from(r, "base64url").toString("utf8"))).exp * 1e3;
  } catch {
    return 0;
  }
}
var cUt,
  uUt,
  dUt,
  pUt,
  mUt,
  fUt,
  jUe,
  hUt,
  p8 = g(() => {
    $();
    Tr();
    Yr();
    wo();
    ((cUt = d.object({
      data: d.object({
        viewer: d.object({ login: d.string() }),
        repository: d
          .object({ pullRequest: d.object({ body: d.string(), bodyHTML: d.string() }).nullable() })
          .nullable(),
      }),
    })),
      (uUt = /https:\/\/github\.com\/user-attachments\/assets\/(?<assetId>[0-9a-f-]{36})/g),
      (dUt =
        /<(?:img|video)\b[^>]*\bsrc="(?<src>https:\/\/private-user-images\.githubusercontent\.com\/[^"]+)"/gi),
      (pUt = /^\/\d+\/\d+-(?<assetId>[0-9a-f-]{36})\.[^/]+$/),
      (mUt = 6e4),
      (fUt = d.object({ exp: d.number() })),
      (jUe = new Map()),
      (hUt = `
  query($owner: String!, $repo: String!, $number: Int!) {
    viewer { login }
    repository(owner: $owner, name: $repo) {
      pullRequest(number: $number) {
        body
        bodyHTML
      }
    }
  }
`));
  });
var KUe = A((ctn, VUe) => {
  var vUt = pI();
  function bUt(t, e, r) {
    var n = t.length;
    return ((r = r === void 0 ? n : r), !e && r >= n ? t : vUt(t, e, r));
  }
  VUe.exports = bUt;
});
var m8 = A((utn, ZUe) => {
  var SUt = "\\ud800-\\udfff",
    wUt = "\\u0300-\\u036f",
    _Ut = "\\ufe20-\\ufe2f",
    xUt = "\\u20d0-\\u20ff",
    AUt = wUt + _Ut + xUt,
    RUt = "\\ufe0e\\ufe0f",
    EUt = "\\u200d",
    CUt = RegExp("[" + EUt + SUt + AUt + RUt + "]");
  function TUt(t) {
    return CUt.test(t);
  }
  ZUe.exports = TUt;
});
var YUe = A((dtn, XUe) => {
  function PUt(t) {
    return t.split("");
  }
  XUe.exports = PUt;
});
var iqe = A((ptn, oqe) => {
  var JUe = "\\ud800-\\udfff",
    IUt = "\\u0300-\\u036f",
    kUt = "\\ufe20-\\ufe2f",
    DUt = "\\u20d0-\\u20ff",
    MUt = IUt + kUt + DUt,
    OUt = "\\ufe0e\\ufe0f",
    NUt = "[" + JUe + "]",
    f8 = "[" + MUt + "]",
    h8 = "\\ud83c[\\udffb-\\udfff]",
    LUt = "(?:" + f8 + "|" + h8 + ")",
    QUe = "[^" + JUe + "]",
    eqe = "(?:\\ud83c[\\udde6-\\uddff]){2}",
    tqe = "[\\ud800-\\udbff][\\udc00-\\udfff]",
    BUt = "\\u200d",
    rqe = LUt + "?",
    nqe = "[" + OUt + "]?",
    FUt = "(?:" + BUt + "(?:" + [QUe, eqe, tqe].join("|") + ")" + nqe + rqe + ")*",
    $Ut = nqe + rqe + FUt,
    UUt = "(?:" + [QUe + f8 + "?", f8, eqe, tqe, NUt].join("|") + ")",
    qUt = RegExp(h8 + "(?=" + h8 + ")|" + UUt + $Ut, "g");
  function GUt(t) {
    return t.match(qUt) || [];
  }
  oqe.exports = GUt;
});
var aqe = A((mtn, sqe) => {
  var WUt = YUe(),
    HUt = m8(),
    jUt = iqe();
  function zUt(t) {
    return HUt(t) ? jUt(t) : WUt(t);
  }
  sqe.exports = zUt;
});
var cqe = A((ftn, lqe) => {
  var VUt = KUe(),
    KUt = m8(),
    ZUt = aqe(),
    XUt = Ep();
  function YUt(t) {
    return function (e) {
      e = XUt(e);
      var r = KUt(e) ? ZUt(e) : void 0,
        n = r ? r[0] : e.charAt(0),
        o = r ? VUt(r, 1).join("") : e.slice(1);
      return n[t]() + o;
    };
  }
  lqe.exports = YUt;
});
var dqe = A((htn, uqe) => {
  var JUt = cqe(),
    QUt = JUt("toUpperCase");
  uqe.exports = QUt;
});
var mqe = A((gtn, pqe) => {
  var eqt = Ep(),
    tqt = dqe();
  function rqt(t) {
    return tqt(eqt(t).toLowerCase());
  }
  pqe.exports = rqt;
});
function gqe(t, e = [], r = []) {
  let n = Array(),
    o = new Set(),
    i = new Map();
  for (let a of r) a.id != null && i.set(a.id, a);
  let s = (a) => {
    let l = `${a.type}:${a.id}`;
    if (o.has(l)) {
      (nqt(n, a), fqe({ indexedItems: n, itemKeys: o, item: a }));
      return;
    }
    (fqe({ indexedItems: n, itemKeys: o, item: a }),
      o.add(l),
      n.push({ item: a, sequence: n.length }));
  };
  return (
    t.createdAt != null &&
      s({
        actorLogin: t.author?.login ?? null,
        createdAt: t.createdAt,
        event: "opened",
        id: `opened:${t.number ?? t.url ?? t.createdAt}`,
        type: "event",
        url: t.url ?? null,
      }),
    t.commits?.forEach((a) => {
      if (a.committedDate == null || a.oid == null) return;
      let l = a.authors?.[0];
      s({
        commits: [
          {
            authorLogin: l?.user?.login ?? l?.login ?? null,
            authorName: l?.name ?? null,
            committedDate: a.committedDate,
            messageHeadline: a.messageHeadline ?? a.oid,
            oid: a.oid,
            url: a.url ?? (t.url == null ? null : new URL(`../commit/${a.oid}`, t.url).toString()),
          },
        ],
        createdAt: a.committedDate,
        id: `commits:${a.oid}`,
        type: "commit_group",
      });
    }),
    t.comments?.forEach((a, l) => {
      let c = g8({
        authorLogin: a.author?.login ?? null,
        authorAvatarUrl: a.author?.avatarUrl ?? null,
        body: a.body,
        createdAt: a.createdAt,
        id: y8("comment", a.id, a.url, l),
        isMinimized: a.isMinimized,
        type: "comment",
        url: a.url,
      });
      c != null && s(c);
    }),
    t.reviews?.forEach((a, l) => {
      let c = a.id == null ? void 0 : i.get(a.id);
      oqt({
        pushItem: s,
        review: c == null ? a : { ...a, ...c, author: c.author ?? a.author },
        reviewIndex: l,
      });
    }),
    e.forEach(s),
    t.mergedAt != null &&
      s({
        actorLogin: t.mergedBy?.login ?? null,
        createdAt: t.mergedAt,
        event: "merged",
        id: `merged:${t.number ?? t.url ?? t.mergedAt}`,
        type: "event",
        url: t.url ?? null,
      }),
    aqt(
      n
        .sort((a, l) => {
          let c = hqe(a.item) - hqe(l.item);
          return c === 0 ? a.sequence - l.sequence : c;
        })
        .map(({ item: a }) => a),
    )
  );
}
function nqt(t, e) {
  if (e.type === "event" || e.type === "commit_group") return;
  let r = t.find(({ item: n }) => n.type === e.type && n.id === e.id);
  r == null ||
    r.item.type === "event" ||
    r.item.type === "commit_group" ||
    (r.item = {
      ...r.item,
      authorType: e.authorType ?? r.item.authorType,
      body: e.body,
      isPending: e.isPending ?? r.item.isPending,
      isMinimized: e.isMinimized ?? r.item.isMinimized,
      rawBody: e.rawBody ?? r.item.rawBody,
      ...(e.authorAvatarUrl != null ? { authorAvatarUrl: e.authorAvatarUrl } : {}),
      ...(e.diffHunk != null ? { diffHunk: e.diffHunk } : {}),
      ...(e.isResolved != null ? { isResolved: e.isResolved } : {}),
      ...(e.line != null ? { line: e.line } : {}),
      ...(e.nodeId != null ? { nodeId: e.nodeId } : {}),
      ...(e.originalLine != null ? { originalLine: e.originalLine } : {}),
      ...(e.originalStartLine != null ? { originalStartLine: e.originalStartLine } : {}),
      ...(e.path != null ? { path: e.path } : {}),
      ...(e.reviewThreadId != null ? { reviewThreadId: e.reviewThreadId } : {}),
      ...(e.replies != null ? { replies: e.replies } : {}),
      ...(e.side != null ? { side: e.side } : {}),
      ...(e.startLine != null ? { startLine: e.startLine } : {}),
      ...(e.startSide != null ? { startSide: e.startSide } : {}),
      ...(e.viewerCanDelete != null ? { viewerCanDelete: e.viewerCanDelete } : {}),
      ...(e.viewerCanResolve != null ? { viewerCanResolve: e.viewerCanResolve } : {}),
      ...(e.viewerCanUnresolve != null ? { viewerCanUnresolve: e.viewerCanUnresolve } : {}),
      ...(e.viewerCanUpdate != null ? { viewerCanUpdate: e.viewerCanUpdate } : {}),
    });
}
function fqe({ indexedItems: t, item: e, itemKeys: r }) {
  if (
    e.type === "event" ||
    e.type === "commit_group" ||
    e.replies == null ||
    e.replies.length === 0
  )
    return;
  let n = new Set(
    e.replies.map((o) =>
      o.id.startsWith("review-comment-reply:")
        ? o.id.replace("review-comment-reply:", "review-comment:")
        : o.id,
    ),
  );
  for (let o = t.length - 1; o >= 0; o -= 1) {
    let i = t[o]?.item;
    i == null ||
      i.type === "event" ||
      i.type === "commit_group" ||
      (n.has(i.id) && (r.delete(`${i.type}:${i.id}`), t.splice(o, 1)));
  }
}
function oqt({ pushItem: t, review: e, reviewIndex: r }) {
  let n = e.submittedAt ?? e.createdAt;
  if (n == null) return;
  let o = iqt({ review: e, reviewIndex: r, createdAt: n });
  o != null && t(o);
  let i = g8({
    authorLogin: e.author?.login ?? null,
    authorAvatarUrl: e.author?.avatarUrl ?? null,
    body: e.body,
    createdAt: n,
    id: y8("review", e.id, e.url, r),
    isMinimized: e.isMinimized,
    type: "review",
    url: e.url,
  });
  (i != null &&
    t(
      e.viewerCanUpdate == null
        ? i
        : {
            ...i,
            authorType: e.author?.__typename,
            nodeId: e.id,
            rawBody: e.viewerCanUpdate ? (e.body ?? void 0) : void 0,
            viewerCanUpdate: e.viewerCanUpdate,
          },
    ),
    e.comments?.forEach((s, a) => {
      let l = sqt({
        comment: s,
        createdAt: s.createdAt ?? n,
        fallbackAuthorLogin: e.author?.login ?? null,
        fallbackAuthorAvatarUrl: e.author?.avatarUrl ?? null,
        fallbackIndex: r + a,
      });
      l != null && t(l);
    }));
}
function iqt({ createdAt: t, review: e, reviewIndex: r }) {
  let n = e.state?.toUpperCase(),
    o = null;
  return (
    n === "APPROVED" && (o = "approved"),
    n === "CHANGES_REQUESTED" && (o = "changes_requested"),
    o == null
      ? null
      : {
          actorLogin: e.author?.login ?? null,
          createdAt: t,
          event: o,
          id: `review-event:${e.id ?? e.url ?? r}:${o}`,
          type: "event",
          url: e.url ?? null,
        }
  );
}
function sqt({
  comment: t,
  createdAt: e,
  fallbackAuthorLogin: r,
  fallbackAuthorAvatarUrl: n,
  fallbackIndex: o,
}) {
  let i = g8({
    authorLogin: t.author?.login ?? r,
    authorAvatarUrl: t.author?.avatarUrl ?? n,
    body: t.body,
    createdAt: e,
    id: y8("review-comment", t.id, t.url, o),
    type: "review_comment",
    url: t.url,
  });
  return i == null
    ? null
    : {
        ...i,
        diffHunk: t.diffHunk ?? null,
        line: t.line ?? null,
        path: t.path ?? null,
        startLine: t.startLine ?? null,
      };
}
function g8({
  authorLogin: t,
  authorAvatarUrl: e,
  body: r,
  createdAt: n,
  id: o,
  isMinimized: i,
  type: s,
  url: a,
}) {
  let l = r?.trim();
  return !l || n == null
    ? null
    : {
        authorAvatarUrl: e ?? void 0,
        authorLogin: t,
        body: l,
        createdAt: n,
        id: o,
        isMinimized: i,
        type: s,
        url: a ?? null,
      };
}
function y8(t, e, r, n) {
  return `${t}:${e ?? r ?? n}`;
}
function hqe(t) {
  let e = Date.parse(t.createdAt);
  return Number.isNaN(e) ? Number.MAX_SAFE_INTEGER : e;
}
function aqt(t) {
  let e = Array();
  for (let r of t) {
    let n = e.at(-1);
    if (r.type === "commit_group" && n?.type === "commit_group") {
      e[e.length - 1] = { ...n, commits: [...n.commits, ...r.commits], createdAt: r.createdAt };
      continue;
    }
    e.push(r);
  }
  return e;
}
var yqe = g(() => {});
function qN(t) {
  let e = t.body?.trim();
  if (e) return t.bodyHTML == null ? e : d8(e, t.bodyHTML);
}
function cqt(t) {
  let e = t.path?.trim(),
    { line: r, startLine: n } = bqe(t),
    o = t.diffSide == null ? null : t.diffSide === "LEFT" ? "left" : "right",
    i = t.startDiffSide == null ? null : t.startDiffSide === "LEFT" ? "left" : "right";
  if (!e || r == null || o == null) return null;
  let s = (t.comments?.nodes ?? []).flatMap((l) => {
    let c = qN(l);
    if (!c) return [];
    let u = l.author?.login?.trim();
    return [
      u
        ? `@${u}:
${c}`
        : c,
    ];
  }).join(`

`);
  if (!s) return null;
  let a = t.comments?.nodes?.find((l) => l.url?.trim())?.url?.trim() ?? null;
  return {
    type: "comment",
    content: [{ content_type: "text", text: s }],
    isResolved: t.isResolved,
    position: {
      side: o,
      path: e,
      ...(n !== r ? { start_line: n } : {}),
      ...(i != null && i !== o ? { start_side: i } : {}),
      line: r,
    },
    reviewThreadId: t.id ?? null,
    url: a,
    viewerCanResolve: t.viewerCanResolve,
    viewerCanUnresolve: t.viewerCanUnresolve,
  };
}
function uqt(t) {
  let e = t.path?.trim(),
    { line: r, startLine: n } = bqe(t),
    o = t.comments?.nodes ?? [],
    [i, ...s] = o;
  return i == null
    ? []
    : dqt({
        comment: i,
        isResolved: t.isResolved,
        line: r,
        originalLine: t.originalLine,
        originalStartLine: t.originalStartLine,
        path: e ?? null,
        replies: s,
        side: t.diffSide == null ? null : t.diffSide === "LEFT" ? "left" : "right",
        startLine: n,
        startSide: t.startDiffSide == null ? null : t.startDiffSide === "LEFT" ? "left" : "right",
        threadId: t.id ?? null,
        viewerCanResolve: t.viewerCanResolve,
        viewerCanUnresolve: t.viewerCanUnresolve,
      });
}
function bqe(t) {
  let e = t.line ?? t.originalLine ?? t.startLine ?? t.originalStartLine;
  return {
    line: e,
    startLine:
      t.line == null && t.originalLine != null
        ? (t.originalStartLine ?? t.startLine ?? e)
        : (t.startLine ?? t.originalStartLine ?? e),
  };
}
function dqt({
  comment: t,
  isResolved: e,
  line: r,
  originalLine: n,
  originalStartLine: o,
  path: i,
  replies: s,
  side: a,
  startLine: l,
  startSide: c,
  threadId: u,
  viewerCanResolve: p,
  viewerCanUnresolve: m,
}) {
  let f = qN(t),
    h = t.createdAt?.trim();
  return !f || !h
    ? []
    : [
        {
          authorAvatarUrl: t.author?.avatarUrl ?? void 0,
          authorLogin: t.author?.login ?? null,
          authorType: t.author?.__typename,
          body: f,
          createdAt: h,
          diffHunk: t.diffHunk,
          id: `review-comment:${t.id ?? t.url ?? 0}`,
          isResolved: e,
          line: r ?? null,
          nodeId: t.id,
          isPending: t.state === "PENDING",
          pendingReviewId: t.state === "PENDING" ? t.pullRequestReview?.id : void 0,
          originalLine: n ?? null,
          originalStartLine: o ?? null,
          path: i,
          rawBody: t.viewerCanUpdate ? (t.body ?? void 0) : void 0,
          replies: s.flatMap((v, y) => {
            let w = qN(v),
              _ = v.createdAt?.trim();
            return !w || !_
              ? []
              : [
                  {
                    authorAvatarUrl: v.author?.avatarUrl ?? void 0,
                    authorLogin: v.author?.login ?? null,
                    body: w,
                    createdAt: _,
                    id: `review-comment-reply:${v.id ?? v.url ?? y}`,
                    nodeId: v.id,
                    isPending: v.state === "PENDING",
                    pendingReviewId: v.state === "PENDING" ? v.pullRequestReview?.id : void 0,
                    rawBody: v.viewerCanUpdate ? (v.body ?? void 0) : void 0,
                    url: v.url ?? null,
                    viewerCanDelete: v.viewerCanDelete,
                    viewerCanUpdate: v.viewerCanUpdate,
                  },
                ];
          }),
          reviewThreadId: u,
          side: a,
          startLine: l,
          startSide: c,
          type: "review_comment",
          url: t.url ?? null,
          viewerCanDelete: t.viewerCanDelete,
          viewerCanResolve: p,
          viewerCanUnresolve: m,
          viewerCanUpdate: t.viewerCanUpdate,
        },
      ];
}
function pqt(t) {
  return t.flatMap((e, r) => {
    let n = qN(e),
      o = e.createdAt?.trim();
    return !n || !o
      ? []
      : [
          {
            authorAvatarUrl: e.author?.avatarUrl ?? void 0,
            authorLogin: e.author?.login ?? null,
            authorType: e.author?.__typename,
            body: n,
            createdAt: o,
            id: `comment:${e.id ?? e.url ?? r}`,
            isMinimized: e.isMinimized,
            nodeId: e.id,
            rawBody: e.viewerCanUpdate ? (e.body ?? void 0) : void 0,
            type: "comment",
            url: e.url ?? null,
            viewerCanDelete: e.viewerCanDelete,
            viewerCanUpdate: e.viewerCanUpdate,
          },
        ];
  });
}
async function Sqe(t, e, r) {
  let n = zt(t, e);
  try {
    return await mqt(t, e, n.repo, r);
  } catch {
    return (r?.throwIfAborted(), { status: "unavailable" });
  }
}
async function mqt(t, e, r, n) {
  let o = Js(r);
  if (o == null) return { status: "unavailable" };
  let i = t.pullRequest.number,
    s = {},
    a,
    l = { comments: null, reviews: null, threads: null, commits: null },
    c = [],
    u = [],
    p = [],
    m = [],
    f = [],
    h = null,
    v = !1,
    y = 0;
  for (let w = 0; ; w += 1) {
    n?.throwIfAborted();
    let _ = w === 0,
      S = [
        "api",
        "graphql",
        "-f",
        `query=${lqt}`,
        "-F",
        `owner=${o.owner}`,
        "-F",
        `repo=${o.repo}`,
        "-F",
        `number=${i}`,
        "-f",
        `login=${t.account.login}`,
        "-F",
        `includeSummary=${_}`,
      ];
    for (let [M, L] of Object.entries(l))
      (S.push("-F", `include${(0, vqe.default)(M)}=${_ || L != null}`),
        L != null && S.push("-f", `${M}${M === "commits" ? "Before" : "After"}=${L}`));
    o.hostname != null && S.push("--hostname", o.hostname);
    let E = await Le(S, {
      signal: n,
      appServerClient: e,
      retrySecondaryRateLimit: !0,
      timeoutMs: 5e3,
    });
    if (!E.success) throw new Error(hi(E, "Failed to determine pull request status"));
    let T = ur(E.stdout || "{}", kUe);
    if ((n?.throwIfAborted(), T.data.viewer.login.toLowerCase() !== t.account.login.toLowerCase()))
      return { status: "unavailable" };
    let P = T.data.repository?.pullRequest;
    if (P == null) return { status: "not-found" };
    if (s.headRefOid != null && (s.headRefOid !== P.headRefOid || a !== P.baseRefOid))
      return { status: "unavailable" };
    if (_) {
      a = P.baseRefOid;
      let M = P.pendingReviews?.nodes[0];
      if (M != null) {
        if (M.author.login.toLowerCase() !== t.account.login.toLowerCase())
          return { status: "unavailable" };
        h = {
          id: M.id,
          body: M.body,
          headRevision: M.commit?.oid ?? null,
          commentCount: M.comments.totalCount,
        };
      }
      s = { ...P, comments: void 0, reviews: void 0, commits: void 0 };
    }
    (c.unshift(
      ...(P.commits?.nodes ?? []).map(({ commit: M }) => ({ ...M, authors: M.authors?.nodes })),
    ),
      m.push(...pqt(P.comments?.nodes ?? [])),
      f.push(...(P.reviews?.nodes ?? []).filter((M) => M.state !== "PENDING")));
    for (let M of P.reviewThreads?.nodes ?? []) {
      if (
        ((v = v || M.comments?.pageInfo?.hasNextPage === !0),
        p.push(...uqt(M)),
        M.isResolved === !0)
      )
        continue;
      M.comments?.nodes?.[0]?.state !== "PENDING" && (y += 1);
      let L = cqt(M);
      L && u.push(L);
    }
    for (let [M, L] of [
      ["comments", P.comments],
      ["reviews", P.reviews],
      ["threads", P.reviewThreads],
      ["commits", P.commits],
    ]) {
      let V = l[M],
        de = L?.pageInfo;
      l[M] = null;
      let ue = M === "commits" ? de?.startCursor : de?.endCursor;
      (M === "commits" ? de?.hasPreviousPage : de?.hasNextPage) &&
        (ue == null || ue === V || w === 19 ? (v = !0) : (l[M] = ue));
    }
    if (!Object.values(l).some((M) => M != null))
      return {
        status: "success",
        activityItems: gqe({ ...s, commits: c, reviews: f }, [...m, ...p]),
        commentAttachments: u,
        supportsPendingReview: !0,
        pendingReview: h,
        isPartial: v,
        unresolvedCommentCount: y,
      };
  }
}
var vqe,
  lqt,
  wqe = g(() => {
    vqe = F(mqe());
    yqe();
    p8();
    vd();
    Tr();
    Yr();
    wo();
    lqt = `query($owner:String!,$repo:String!,$number:Int!,$login:String!,$commentsAfter:String,$reviewsAfter:String,$threadsAfter:String,$commitsBefore:String,$includeComments:Boolean!,$includeReviews:Boolean!,$includeThreads:Boolean!,$includeCommits:Boolean!,$includeSummary:Boolean!){viewer{login} repository(owner:$owner,name:$repo){pullRequest(number:$number){
createdAt @include(if:$includeSummary) author @include(if:$includeSummary){login} number url headRefOid baseRefOid
mergedAt @include(if:$includeSummary) mergedBy @include(if:$includeSummary){login}
pendingReviews:reviews(first:1,author:$login,states:PENDING)@include(if:$includeSummary){nodes{id body state author{login} commit{oid} comments{totalCount}}}
commits(last:100,before:$commitsBefore)@include(if:$includeCommits){nodes{commit{oid committedDate messageHeadline url authors(first:1){nodes{name user{login}}}}} pageInfo{hasPreviousPage startCursor}}
comments(first:100,after:$commentsAfter)@include(if:$includeComments){nodes{author{__typename login avatarUrl(size:48)} body bodyHTML createdAt id url isMinimized viewerCanDelete viewerCanUpdate} pageInfo{hasNextPage endCursor}}
reviews(first:100,after:$reviewsAfter)@include(if:$includeReviews){nodes{author{__typename login avatarUrl(size:48)} body createdAt state submittedAt id url isMinimized viewerCanUpdate} pageInfo{hasNextPage endCursor}}
reviewThreads(first:100,after:$threadsAfter)@include(if:$includeThreads){nodes{id comments(first:100){nodes{author{__typename login avatarUrl(size:48)} body bodyHTML createdAt diffHunk id state pullRequestReview{id} url viewerCanDelete viewerCanUpdate} pageInfo{hasNextPage}} diffSide isResolved line originalLine originalStartLine path startDiffSide startLine viewerCanResolve viewerCanUnresolve} pageInfo{hasNextPage endCursor}}
}}}`;
  });
var GN = g(() => {
  O();
});
function Aqe(t) {
  let e = t?.toUpperCase();
  return e == null || !fqt(e) ? "none" : (xqe[e] ?? "none");
}
function Rqe(t, e, r, n = {}) {
  let o = e ?? t.latestReviews ?? [],
    i = new Map(),
    s = {
      approved: [],
      commentCounts: [],
      commented: [],
      changesRequested: [],
      requested: _qe(t, "User"),
      requestedTeamSlugs: Object.fromEntries(
        (t.reviewRequests ?? []).flatMap((l) => {
          if (l.__typename !== "Team" || l.slug == null) return [];
          let c = Eqe(l.slug);
          return [[l.name ?? c, c]];
        }),
      ),
      requestedTeams: _qe(t, "Team"),
    },
    a = { ...n };
  for (let l of [...(t.reviews ?? []), ...o]) {
    let c = l.author?.login,
      u = l.author?.avatarUrl;
    c && u && (a[c] = u);
  }
  for (let l of t.reviews ?? o) {
    let c = l.author?.login;
    if (!c) continue;
    let u = l.state?.toUpperCase();
    u === "APPROVED" || u === "CHANGES_REQUESTED" ? i.set(c, u) : u === "DISMISSED" && i.delete(c);
  }
  for (let l of o) {
    let c = l.author?.login;
    if (!c) continue;
    let u = l.comments?.totalCount ?? 0;
    u > 0 && s.commentCounts.push({ reviewer: c, commentCount: u });
    let p = i.get(c);
    (p === "APPROVED"
      ? s.approved.push(c)
      : p === "CHANGES_REQUESTED" && s.changesRequested.push(c),
      l.state?.toUpperCase() === "COMMENTED" && s.commented.push(c));
  }
  return {
    approved: WN(s.approved),
    avatarUrlsByLogin: a,
    commentCounts: s.commentCounts,
    commented: WN(s.commented),
    changesRequested: WN(s.changesRequested),
    requested: s.requested,
    requestedTeamSlugs: s.requestedTeamSlugs,
    requestedTeams: s.requestedTeams,
    unresolvedCommentCount: r,
  };
}
