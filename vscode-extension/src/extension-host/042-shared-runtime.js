function fqt(t) {
  return t in xqe;
}
function WN(t) {
  return Array.from(new Set(t));
}
function _qe(t, e) {
  return WN(
    (t.reviewRequests ?? [])
      .map((r) =>
        e === "Team" && r.__typename === "Team"
          ? (r.name ?? (r.slug == null ? null : Eqe(r.slug)))
          : e === "User" && r.__typename === "User"
            ? (r.login ?? null)
            : null,
      )
      .filter((r) => r != null),
  );
}
function Eqe(t) {
  return t.slice(t.lastIndexOf("/") + 1);
}
var xqe,
  FA = g(() => {
    O();
    xqe = {
      APPROVED: "approved",
      CHANGES_REQUESTED: "changes_requested",
      REVIEW_REQUIRED: "review_required",
    };
  });
async function Tqe(t, e, r) {
  return "repos" in t
    ? bqt({ gitManager: e, getAppServerClient: r, request: t })
    : Pqe({ appServerClient: r(t.hostId), gitManager: e, request: t });
}
async function Pqe({
  appServerClient: t,
  gitManager: e,
  request: { cwd: r, hostId: n, repo: o, searchQuery: i },
}) {
  try {
    await Cn(t);
    let s = await e.getWorktreeRepository(r, t);
    if (s?.root == null)
      return { error: "No git repository found for pull request board", status: "error" };
    if (o != null) {
      let p = await b8({ appServerClient: t, cwd: s.root, repoArg: o, searchQuery: i });
      return {
        items: Cqe({ items: p, cwd: r, hostId: n, repo: o, searchQuery: i }),
        status: "success",
      };
    }
    let l = await (await e.getRepoRepository(r, t))?.getOriginUrl(),
      c = await s.getConfigValue("remote.upstream.url"),
      u = await wqt({
        appServerClient: t,
        cwd: s.root,
        originUrl: l,
        preferredRepoArg: o,
        searchQuery: i,
        upstreamUrl: c,
      });
    return {
      items: Cqe({ items: u, cwd: r, hostId: n, repo: o, searchQuery: i }),
      status: "success",
    };
  } catch (s) {
    return (
      vqt().warning("gh.pr.board.failed", {
        safe: { hasPreferredRepo: o != null },
        sensitive: { error: s },
      }),
      { error: s instanceof Error ? s.message : String(s), status: "error" }
    );
  }
}
async function bqt({
  gitManager: t,
  getAppServerClient: e,
  request: { repos: r, searchQuery: n },
}) {
  let o = await Promise.all(
    r.map((s) =>
      Pqe({
        appServerClient: e(s.hostId),
        gitManager: t,
        request: { cwd: s.cwd, hostId: s.hostId, repo: s.repo, searchQuery: n },
      }),
    ),
  );
  return o.some((s) => s.status === "success")
    ? { items: Sqt(o.flatMap((s) => (s.status === "success" ? s.items : []))), status: "success" }
    : (o[0] ?? { items: [], status: "success" });
}
function Sqt(t) {
  return [...t].sort((e, r) => r.updatedAt.localeCompare(e.updatedAt));
}
async function v8({
  appServerClient: t,
  cwd: e,
  includePullRequestStatusFields: r = !0,
  repoArg: n,
  searchQuery: o,
  state: i = "all",
}) {
  let s = await Le(
    xqt({ includePullRequestStatusFields: r, repoArg: n, searchQuery: o, state: i }),
    { appServerClient: t, cwd: e, retrySecondaryRateLimit: !0, timeoutMs: 1e4 },
  );
  if (!s.success) throw new Error(hi(s, "Failed to list pull requests"));
  return ur(s.stdout || "[]", EUe);
}
function Cqe({ cwd: t, hostId: e, items: r, repo: n, searchQuery: o }) {
  return r.flatMap((i) => {
    let s = o == null,
      a = i.state.toUpperCase();
    if (a !== "OPEN" && a !== "MERGED") return [];
    if (a === "MERGED")
      return [
        {
          additions: i.additions,
          baseBranch: i.baseRefName,
          canMerge: !1,
          ciStatus: "none",
          createdAt: i.createdAt,
          cwd: t,
          deletions: i.deletions,
          headBranch: i.headRefName,
          hostId: e,
          isAuthor: s,
          mergeBlocker: null,
          number: i.number,
          repo: n ?? void 0,
          state: "merged",
          title: i.title,
          updatedAt: i.updatedAt,
          url: i.url,
        },
      ];
    let { ciStatus: l } = Up(HI(i.statusCheckRollup)),
      c = qp({
        hasOpenPr: !0,
        isDraft: i.isDraft,
        mergeStateStatus: i.mergeStateStatus,
        mergeable: i.mergeable,
      });
    return [
      {
        additions: i.additions,
        baseBranch: i.baseRefName,
        canMerge: c,
        ciStatus: l,
        createdAt: i.createdAt,
        cwd: t,
        deletions: i.deletions,
        headBranch: i.headRefName,
        hostId: e,
        isAuthor: s,
        mergeBlocker: Gp({ mergeStateStatus: i.mergeStateStatus, mergeable: i.mergeable }),
        number: i.number,
        repo: n ?? void 0,
        state: Aqt({ canMerge: c, ciStatus: l, isDraft: i.isDraft }),
        title: i.title,
        updatedAt: i.updatedAt,
        url: i.url,
      },
    ];
  });
}
async function wqt({
  appServerClient: t,
  cwd: e,
  originUrl: r,
  preferredRepoArg: n,
  searchQuery: o,
  upstreamUrl: i,
}) {
  if (n != null) return b8({ appServerClient: t, cwd: e, repoArg: n, searchQuery: o });
  let s = _qt({
      originRepoArg: r != null ? vv(r) : null,
      upstreamRepoArg: i != null ? vv(i) : null,
    }),
    a = [];
  for (let l of s)
    if (((a = await b8({ appServerClient: t, cwd: e, repoArg: l, searchQuery: o })), a.length > 0))
      return a;
  return a;
}
async function b8({ appServerClient: t, cwd: e, repoArg: r, searchQuery: n }) {
  if (n != null) return v8({ appServerClient: t, cwd: e, repoArg: r, searchQuery: n });
  let [o, i] = await Promise.all([
    v8({ appServerClient: t, cwd: e, repoArg: r, searchQuery: null, state: "open" }),
    v8({
      appServerClient: t,
      cwd: e,
      includePullRequestStatusFields: !1,
      repoArg: r,
      searchQuery: null,
      state: "merged",
    }),
  ]);
  return [...o, ...i];
}
function _qt({ originRepoArg: t, upstreamRepoArg: e }) {
  return Array.from(new Set([e, t].filter((r) => r != null)));
}
function xqt({
  includePullRequestStatusFields: t = !0,
  repoArg: e,
  searchQuery: r,
  state: n = "all",
}) {
  let o = r?.trim() ?? "",
    i = [
      "pr",
      "list",
      "--state",
      n,
      "--limit",
      String(hqt),
      "--json",
      [...gqt, ...(t ? yqt : [])].join(","),
    ];
  return (
    r == null ? i.push("--author", "@me") : o.length > 0 && i.push("--search", o),
    e != null && i.push("--repo", e),
    i
  );
}
function Aqt({ canMerge: t, ciStatus: e, isDraft: r }) {
  if (r) return "draft";
  switch (e) {
    case "failing":
      return "failing";
    case "none":
    case "passing":
    case "pending":
      return t ? "ready" : "in_progress";
  }
}
var hqt,
  gqt,
  yqt,
  vqt,
  S8 = g(() => {
    Bt();
    gi();
    vd();
    c8();
    Tr();
    Yr();
    GN();
    FA();
    ((hqt = 10),
      (gqt = [
        "additions",
        "baseRefName",
        "createdAt",
        "deletions",
        "headRefName",
        "isDraft",
        "number",
        "state",
        "title",
        "updatedAt",
        "url",
      ]),
      (yqt = ["mergeStateStatus", "mergeable", "statusCheckRollup"]),
      (vqt = Ie("github")));
  });
async function Iqe(t, e) {
  try {
    let r = zt(t, e),
      n = t.expectedHeadRevision.trim();
    return n.length === 0
      ? { status: "error", error: "Expected pull request head revision is required" }
      : (await Cn(e, void 0, r.hostname),
        await Rqt({
          appServerClient: e,
          expectedHeadRevision: n,
          mergeMethod: t.mergeMethod,
          number: r.number,
          repo: r.repo,
        }));
  } catch (r) {
    return { status: "error", error: r instanceof Error ? r.message : String(r) };
  }
}
async function Rqt({
  appServerClient: t,
  expectedHeadRevision: e,
  mergeMethod: r,
  number: n,
  repo: o,
}) {
  let i = [
      "pr",
      "merge",
      String(n),
      r === "squash" ? "--squash" : "--merge",
      "--match-head-commit",
      e,
      ...(o == null ? [] : ["--repo", o]),
    ],
    s = await Le(i, { appServerClient: t, timeoutMs: 15e3 });
  return s.success ? { status: "success" } : $r(s, "Failed to merge pull request");
}
var w8 = g(() => {
  gi();
  Tr();
  Yr();
  wo();
});
async function Nqe(t, e, r) {
  try {
    await $A(t, e);
    let { base: n, head: o } = Cqt.parse(
        JSON.parse(await jN(t, e, `pulls/${t.pullRequest.number}`, [], r)),
      ),
      i = Tqt.parse(
        JSON.parse(
          await jN(t, e, `compare/${n.sha}...${o.sha}?per_page=100`, ["--paginate", "--slurp"], r),
        ),
      ),
      s = i[0]?.merge_base_commit.sha;
    return s == null
      ? { status: "error", error: "GitHub returned no pull request merge base" }
      : {
          status: "success",
          snapshot: {
            baseRevision: n.sha,
            headRevision: o.sha,
            mergeBaseRevision: s,
            commits: i.flatMap((a) =>
              a.commits.map((l) => ({
                sha: l.sha,
                parentSha: l.parents[0]?.sha ?? null,
                title:
                  l.commit.message.split(`
`)[0] ?? "",
              })),
            ),
          },
        };
  } catch (n) {
    return { status: "error", error: n instanceof Error ? n.message : String(n) };
  }
}
async function Lqe(t, e, r) {
  try {
    let n = ea.parse(t.comparison.baseRevision),
      o = ea.parse(t.comparison.headRevision);
    await $A(t, e);
    let i = await jN(t, e, `compare/${n}...${o}`, ["-H", "Accept: application/vnd.github.diff"], r);
    return { status: "success", headRevision: o, unifiedDiff: i };
  } catch (n) {
    return { status: "error", error: n instanceof Error ? n.message : String(n) };
  }
}
async function Bqe(t, e, r) {
  let n = _8.get(e.id);
  (n == null && ((n = { semaphore: new Oqe.Sema(2), requests: 0 }), _8.set(e.id, n)),
    (n.requests += 1));
  let o = n.semaphore.acquire();
  try {
    (await (r == null ? o : Lt(o, r)), r?.throwIfAborted());
    let i = ea.parse(t.comparison.baseRevision),
      s = ea.parse(t.comparison.headRevision),
      a = HN.nullable().parse(t.basePath),
      l = HN.nullable().parse(t.headPath);
    (await $A(t, e), r?.throwIfAborted());
    let [c, u] = await Promise.allSettled([Dqe(t, e, a, i, r), Dqe(t, e, l, s, r)]);
    if (c.status === "rejected") throw c.reason;
    if (u.status === "rejected") throw u.reason;
    return c.value == null || u.value == null
      ? { status: "unavailable" }
      : { status: "success", baseContent: c.value, headContent: u.value };
  } catch (i) {
    return { status: "error", error: i instanceof Error ? i.message : String(i) };
  } finally {
    o.then(() => {
      (n.semaphore.release(), (n.requests -= 1), n.requests === 0 && _8.delete(e.id));
    });
  }
}
async function Dqe(t, e, r, n, o) {
  if (r == null) return "";
  let i = r.split("/").map(encodeURIComponent).join("/"),
    s = Eqt.parse(
      JSON.parse(
        await jN(
          t,
          e,
          `contents/${i}?ref=${n}`,
          ["-H", "Accept: application/vnd.github.object+json"],
          o,
        ),
      ),
    );
  if (s.size > kqe || s.encoding !== "base64") return null;
  let a = Buffer.from(s.content, "base64");
  return a.byteLength > kqe || a.includes(0) || !(0, Mqe.isUtf8)(a) ? null : a.toString("utf8");
}
async function $A(t, e) {
  let r = zt(t, e),
    n = await gv(e, r.hostname);
  if (n.status !== "success" || n.account.login.toLowerCase() !== t.account.login.toLowerCase())
    throw new Error(
      "Exact-revision review requires GitHub CLI signed in to the selected GitHub account",
    );
}
async function jN(t, e, r, n, o) {
  let i = zt(t, e),
    { owner: s, repository: a } = t.pullRequest,
    l = await Le(
      [
        "api",
        "--hostname",
        i.hostname,
        `repos/${encodeURIComponent(s)}/${encodeURIComponent(a)}/${r}`,
        ...n,
      ],
      {
        appServerClient: e,
        retrySecondaryRateLimit: !0,
        signal: o,
        timeoutMs: 3e4,
        trimStdout: !1,
      },
    );
  if (!l.success) throw new Error(l.stderr || "Could not read pull request revisions");
  return l.stdout;
}
var Mqe,
  x8,
  Oqe,
  _8,
  ea,
  HN,
  Eqt,
  kqe,
  Cqt,
  Tqt,
  A8 = g(() => {
    ((Mqe = require("node:buffer")), (x8 = require("node:path")), (Oqe = F(Gx())));
    O();
    $();
    gi();
    Tr();
    wo();
    ((_8 = new Map()),
      (ea = d.string().regex(/^[a-f\d]{40}$/i)),
      (HN = d
        .string()
        .min(1)
        .refine(
          (t) =>
            !x8.posix.isAbsolute(t) &&
            x8.posix.normalize(t) === t &&
            t !== ".." &&
            !t.startsWith("../"),
          "Expected a repository-relative file path",
        )),
      (Eqt = d.object({
        type: d.literal("file"),
        encoding: d.string(),
        size: d.number().int().nonnegative(),
        content: d.string(),
      })),
      (kqe = 1024 * 1024),
      (Cqt = d.object({ base: d.object({ sha: ea }), head: d.object({ sha: ea }) })),
      (Tqt = d.array(
        d.object({
          merge_base_commit: d.object({ sha: ea }),
          commits: d.array(
            d.object({
              sha: ea,
              parents: d.array(d.object({ sha: ea })),
              commit: d.object({ message: d.string() }),
            }),
          ),
        }),
      )));
  });
async function $qe(t, e, r) {
  try {
    let n = ea.parse(t.headRevision),
      o = d.array(HN).parse(t.paths),
      i = zt(t, e);
    await $A(t, e);
    let s = new Set();
    for (let l of o)
      for (let c = zN.posix.dirname(l); s.add(c), c !== "."; c = zN.posix.dirname(c));
    let a = [];
    for (let l of (0, Fqe.default)(Array.from(s), 50)) {
      r?.throwIfAborted();
      let c = l.map(
          (m, f) =>
            `f${f}: object(expression: ${JSON.stringify(`${n}:${zN.posix.join(m, ".gitattributes")}`)}) { ... on Blob { text isTruncated } }`,
        ),
        u = await Le(
          [
            "api",
            "--hostname",
            i.hostname,
            "graphql",
            "-f",
            `query=query { repository(owner: ${JSON.stringify(t.pullRequest.owner)}, name: ${JSON.stringify(t.pullRequest.repository)}) { ${c.join(`
`)} } }`,
          ],
          { appServerClient: e, signal: r, retrySecondaryRateLimit: !0, timeoutMs: 3e4 },
        );
      if (!u.success)
        return { status: "error", error: u.stderr || "Could not read pull request attributes" };
      let { data: p } = Pqt.parse(JSON.parse(u.stdout));
      for (let [m, f] of l.entries()) {
        let h = p.repository[`f${m}`];
        if (h?.isTruncated)
          return { status: "error", error: "Pull request attributes were truncated" };
        h?.text != null && a.push({ basePath: f === "." ? "" : f, contents: h.text });
      }
    }
    return { status: "success", files: a };
  } catch (n) {
    return { status: "error", error: n instanceof Error ? n.message : String(n) };
  }
}
var zN,
  Fqe,
  Pqt,
  Uqe = g(() => {
    ((zN = require("node:path")), (Fqe = F(Bu())));
    $();
    Tr();
    wo();
    A8();
    Pqt = d.object({
      data: d.object({
        repository: d.record(
          d.string(),
          d.object({ text: d.string().nullable(), isTruncated: d.boolean() }).nullable(),
        ),
      }),
    });
  });
async function qqe(t, e, r) {
  zt(t, e);
  try {
    let n = await R8(
      t,
      e,
      "query($owner:String!,$repo:String!,$number:Int!){viewer{login} repository(owner:$owner,name:$repo){viewerPermission mergeCommitAllowed squashMergeAllowed pullRequest(number:$number){additions deletions changedFiles headRefOid viewerCanUpdate viewerCanClose viewerCanReopen viewerCanEnableAutoMerge viewerCanDisableAutoMerge author{login avatarUrl} createdAt autoMergeRequest{enabledAt}}}}",
      Iqt,
      r,
    );
    if (n.data.viewer.login.toLowerCase() !== t.account.login.toLowerCase())
      return { status: "unavailable" };
    let o = n.data.repository,
      i = o?.pullRequest;
    return i == null || o == null
      ? { status: "not-found" }
      : {
          status: "success",
          viewerCanUpdate: i.viewerCanUpdate,
          viewerCanClose: i.viewerCanClose,
          viewerCanReopen: i.viewerCanReopen,
          canManageAutoMerge:
            i.autoMergeRequest != null ? i.viewerCanDisableAutoMerge : i.viewerCanEnableAutoMerge,
          hasWritePermission:
            o.viewerPermission != null &&
            ["WRITE", "MAINTAIN", "ADMIN"].includes(o.viewerPermission),
          canManageReviewers:
            o.viewerPermission != null &&
            ["TRIAGE", "WRITE", "MAINTAIN", "ADMIN"].includes(o.viewerPermission),
          additions: i.additions ?? null,
          deletions: i.deletions ?? null,
          changedFiles: i.changedFiles ?? null,
          headRevision: i.headRefOid,
          authorAvatarUrl: i.author?.avatarUrl ?? null,
          authorLogin: i.author?.login ?? null,
          createdAt: i.createdAt ?? null,
          isAuthor: i.author?.login?.toLowerCase() === t.account.login.toLowerCase(),
          isAutoMergeEnabled: i.autoMergeRequest != null,
          allowedMergeMethods: [
            ...(o.squashMergeAllowed ? ["squash"] : []),
            ...(o.mergeCommitAllowed ? ["merge"] : []),
          ],
        };
  } catch {
    return (r?.throwIfAborted(), { status: "unavailable" });
  }
}
async function Gqe(t, e, r) {
  zt(t, e);
  try {
    let n = await R8(
      t,
      e,
      "query($owner:String!,$repo:String!,$number:Int!){viewer{login} repository(owner:$owner,name:$repo){pullRequest(number:$number){headRefOid baseRefOid state isDraft mergeable mergeStateStatus}}}",
      kqt,
      r,
    );
    if (n.data.viewer.login.toLowerCase() !== t.account.login.toLowerCase())
      return { status: "unavailable" };
    let o = n.data.repository?.pullRequest;
    return o == null
      ? { status: "not-found" }
      : {
          status: "success",
          headRevision: o.headRefOid,
          baseRevision: o.baseRefOid,
          canMerge: qp({ ...o, hasOpenPr: o.state === "OPEN" }),
          mergeBlocker: o.state === "OPEN" ? Gp(o) : null,
        };
  } catch {
    return (r?.throwIfAborted(), { status: "unavailable" });
  }
}
async function Wqe(t, e, r) {
  zt(t, e);
  let n = { reviews: [] },
    o = {},
    i = null,
    s = !1;
  try {
    for (let c = 0; c < 20; c += 1) {
      let u = await R8(
        t,
        e,
        "query($owner:String!,$repo:String!,$number:Int!,$after:String,$first:Boolean!){viewer{login} repository(owner:$owner,name:$repo){pullRequest(number:$number){reviewDecision latestReviews(first:100)@include(if:$first){nodes{author{login avatarUrl} state comments(first:1){totalCount}} pageInfo{hasNextPage}} reviewRequests(first:100)@include(if:$first){nodes{requestedReviewer{__typename ... on User{login avatarUrl} ... on Team{name slug}}} pageInfo{hasNextPage}} reviews(first:100,after:$after){nodes{author{login} state submittedAt} pageInfo{hasNextPage endCursor}}}}}",
        Dqt,
        r,
        ["-F", `first=${c === 0}`, ...(i == null ? [] : ["-f", `after=${i}`])],
      );
      if (u.data.viewer.login.toLowerCase() !== t.account.login.toLowerCase())
        return { status: "unavailable" };
      let p = u.data.repository?.pullRequest;
      if (p == null) return { status: "not-found" };
      ((n.reviewDecision = p.reviewDecision),
        n.reviews?.push(...p.reviews.nodes),
        c === 0 &&
          ((n.latestReviews = p.latestReviews?.nodes),
          (n.reviewRequests = p.reviewRequests?.nodes.flatMap(({ requestedReviewer: f }) =>
            f?.__typename === "Team"
              ? [{ __typename: "Team", name: f.name, slug: f.slug }]
              : f?.__typename !== "User"
                ? []
                : (f.login != null && f.avatarUrl != null && (o[f.login] = f.avatarUrl),
                  [{ __typename: "User", login: f.login }]),
          )),
          (s =
            p.latestReviews?.pageInfo.hasNextPage === !0 ||
            p.reviewRequests?.pageInfo.hasNextPage === !0)));
      let m = p.reviews.pageInfo;
      if (!m.hasNextPage) break;
      if (m.endCursor == null || m.endCursor === i || c === 19) {
        s = !0;
        break;
      }
      i = m.endCursor;
    }
    let { unresolvedCommentCount: a, ...l } = Rqe(n, n.latestReviews ?? null, 0, o);
    return { status: "success", reviewers: l, reviewStatus: Aqe(n.reviewDecision), isPartial: s };
  } catch {
    return (r?.throwIfAborted(), { status: "unavailable" });
  }
}
async function R8(t, e, r, n, o, i = []) {
  o?.throwIfAborted();
  let s = t.pullRequest,
    a = await Le(
      [
        "api",
        "graphql",
        "--hostname",
        s.hostname,
        "-f",
        `query=${r}`,
        "-f",
        `owner=${s.owner}`,
        "-f",
        `repo=${s.repository}`,
        "-F",
        `number=${s.number}`,
        ...i,
      ],
      { appServerClient: e, signal: o, retrySecondaryRateLimit: !0, timeoutMs: 5e3 },
    );
  if ((o?.throwIfAborted(), !a.success)) throw new Error("Pull request resource unavailable");
  return ur(a.stdout, n);
}
var Iqt,
  kqt,
  Dqt,
  Hqe = g(() => {
    $();
    vd();
    Tr();
    Yr();
    wo();
    FA();
    ((Iqt = d.object({
      data: d.object({
        viewer: d.object({ login: d.string() }),
        repository: d
          .object({
            viewerPermission: d.string().nullable(),
            mergeCommitAllowed: d.boolean(),
            squashMergeAllowed: d.boolean(),
            pullRequest: Qs.extend({
              changedFiles: d.number().int().nonnegative().nullish(),
              headRefOid: d.string().min(1),
              viewerCanUpdate: d.boolean(),
              viewerCanClose: d.boolean().default(!1),
              viewerCanReopen: d.boolean().default(!1),
              viewerCanEnableAutoMerge: d.boolean().default(!1),
              viewerCanDisableAutoMerge: d.boolean().default(!1),
            }).nullable(),
          })
          .nullable(),
      }),
    })),
      (kqt = d.object({
        data: d.object({
          viewer: d.object({ login: d.string() }),
          repository: d
            .object({
              pullRequest: d
                .object({
                  headRefOid: d.string().min(1),
                  baseRefOid: d.string().min(1),
                  state: d.enum(["OPEN", "CLOSED", "MERGED"]),
                  isDraft: d.boolean(),
                  mergeable: d.string(),
                  mergeStateStatus: d.string(),
                })
                .nullable(),
            })
            .nullable(),
        }),
      })),
      (Dqt = d.object({
        data: d.object({
          viewer: d.object({ login: d.string() }),
          repository: d
            .object({
              pullRequest: d
                .object({
                  reviewDecision: Qs.shape.reviewDecision,
                  latestReviews: d
                    .object({
                      nodes: Qs.shape.latestReviews.unwrap(),
                      pageInfo: d.object({ hasNextPage: d.boolean() }),
                    })
                    .optional(),
                  reviewRequests: d
                    .object({
                      nodes: d.array(
                        d.object({
                          requestedReviewer: d
                            .object({
                              __typename: d.string(),
                              login: d.string().optional(),
                              avatarUrl: d.string().optional(),
                              name: d.string().optional(),
                              slug: d.string().optional(),
                            })
                            .nullable(),
                        }),
                      ),
                      pageInfo: d.object({ hasNextPage: d.boolean() }),
                    })
                    .optional(),
                  reviews: d.object({
                    nodes: Qs.shape.reviews.unwrap(),
                    pageInfo: d.object({
                      hasNextPage: d.boolean(),
                      endCursor: d.string().nullable(),
                    }),
                  }),
                })
                .nullable(),
            })
            .nullable(),
        }),
      })));
  });
async function Zqe(t, e, r, n) {
  try {
    let o = zt(t, e),
      i = await gv(e, o.hostname);
    if (i.status !== "success" || i.account.login.toLowerCase() !== t.account.login.toLowerCase())
      return {
        status: "error",
        error: "Sign in to the selected GitHub account to load pull requests",
      };
    let s = C8.parse(await VN(t, e, `pulls/${o.number}`, r));
    if (s.state !== "open") return { status: "success", entries: [] };
    await n?.({ status: "loading", entries: E8([s]) });
    let a;
    if (s.stack?.number != null)
      a = d
        .object({ pull_requests: Kqe })
        .parse(await VN(t, e, `stacks/${s.stack.number}`, r))
        .pull_requests.filter((u) => u.state === "open")
        .map((u) =>
          u.number === s.number
            ? { ...u, additions: u.additions ?? s.additions, deletions: u.deletions ?? s.deletions }
            : u,
        );
    else {
      a = [s];
      let c = new Set([s.number]);
      for (let u = 0; u < a.length; u += 1) {
        let p = a[u];
        if (p == null) break;
        r?.throwIfAborted();
        let [m, f] = await Promise.all([
            p.base.repo == null
              ? []
              : zqe(
                  t,
                  e,
                  "head",
                  `${p.base.repo.owner?.login ?? t.pullRequest.owner}:${p.base.ref}`,
                  r,
                ),
            p.head.repo?.id !== s.base.repo?.id ? [] : zqe(t, e, "base", p.head.ref, r),
          ]),
          h = a.length;
        for (let v of [...m.filter((y) => T8(y, p)), ...f.filter((y) => T8(p, y))])
          if (!c.has(v.number)) {
            if (a.length === P8)
              throw new Error("This pull request stack exceeds the 50-PR review limit");
            (c.add(v.number), a.push(v));
          }
        a.length !== h && (await n?.({ status: "loading", entries: E8(a) }));
      }
    }
    let l = E8(a);
    await n?.({ status: "loading", entries: l.map((c) => ({ ...c })) });
    for (let c of (0, Vqe.default)(
      l.filter((u) => u.diffStats == null),
      4,
    )) {
      let u = !1;
      if (
        (await Promise.all(
          c.map(async (p) => {
            try {
              let m = C8.parse(await VN(t, e, `pulls/${p.number}`, r));
              m.additions != null &&
                m.deletions != null &&
                (p.diffStats = { additions: m.additions, deletions: m.deletions });
            } catch {
              (r?.throwIfAborted(), (u = !0));
            }
          }),
        ),
        await n?.({ status: "loading", entries: l.map((p) => ({ ...p })) }),
        u)
      )
        break;
    }
    return { status: "success", entries: l };
  } catch (o) {
    return { status: "error", error: o instanceof Error ? o.message : String(o) };
  }
}
function E8(t) {
  let e = t.map((o) => {
      let i = t.filter((s) => T8(s, o));
      if (i.length > 1) throw new Error("Multiple open pull requests match a stack base branch");
      return {
        number: o.number,
        title: o.title,
        isDraft: o.draft,
        baseBranch: o.base.ref,
        headBranch: o.head.ref,
        parentNumber: i[0]?.number ?? null,
        diffStats:
          o.additions != null && o.deletions != null
            ? { additions: o.additions, deletions: o.deletions }
            : null,
      };
    }),
    r = [],
    n = (o) => {
      for (let i of e.filter((s) => s.parentNumber === o)) (r.push(i), n(i.number));
    };
  if ((n(null), r.length !== e.length))
    throw new Error("Pull request branch relationships contain a cycle");
  return r;
}
function T8(t, e) {
  return (
    t.number !== e.number &&
    t.head.repo != null &&
    t.head.repo.id === e.base.repo?.id &&
    t.head.ref === e.base.ref
  );
}
async function zqe(t, e, r, n, o) {
  return Kqe.parse(
    await VN(t, e, `pulls?state=open&per_page=${P8 + 1}&${r}=${encodeURIComponent(n)}`, o),
  );
}
async function VN(t, e, r, n) {
  n?.throwIfAborted();
  let { owner: o, repository: i, hostname: s } = t.pullRequest,
    a = await Le(
      ["api", "--hostname", s, `repos/${encodeURIComponent(o)}/${encodeURIComponent(i)}/${r}`],
      { appServerClient: e, signal: n, timeoutMs: 3e4, retrySecondaryRateLimit: !0 },
    );
  if (!a.success) throw new Error(a.stderr || "Could not load pull request stack");
  return JSON.parse(a.stdout);
}
var Vqe,
  P8,
  jqe,
  C8,
  Kqe,
  Xqe = g(() => {
    Vqe = F(Bu());
    $();
    gi();
    Tr();
    wo();
    ((P8 = 50),
      (jqe = d.object({
        ref: d.string(),
        repo: d
          .object({ id: d.number(), owner: d.object({ login: d.string() }).optional() })
          .nullable(),
      })),
      (C8 = d.object({
        number: d.number().int().positive(),
        title: d.string(),
        draft: d.boolean().default(!1),
        state: d.enum(["open", "closed"]),
        additions: d.number().int().nonnegative().nullish(),
        deletions: d.number().int().nonnegative().nullish(),
        base: jqe,
        head: jqe,
        stack: d.object({ number: d.number().int().positive().optional() }).nullish(),
      })),
      (Kqe = d.array(C8).max(P8)));
  });
function Yqe(t, e, r) {
  zt(t, e);
  let n = JSON.stringify([e.id, t.account.hostname.toLowerCase(), t.account.login.toLowerCase()]),
    o = I8.get(n);
  return (
    o == null && ((o = new k8(t.account, () => I8.delete(n))), I8.set(n, o)),
    o.read(t.pullRequest, e, r)
  );
}
async function Uqt(t, e, r, n) {
  let o = r.map(() => ({ status: "unavailable" })),
    i = r.map((s, a) => ({
      pullRequest: s,
      index: a,
      cursor: null,
      headRevision: null,
      checks: Array(),
    }));
  for (let s = 0; i.length > 0 && s < Oqt && n(); s++) {
    let a = `query { viewer { login } ${i.map(({ pullRequest: h, index: v, cursor: y }) => `p${v}: repository(owner:${JSON.stringify(h.owner)},name:${JSON.stringify(h.repository)}) { pullRequest(number:${h.number}) { number url title totalCommentsCount baseRefName headRefName state isDraft isInMergeQueue baseRefOid headRefOid headRepository { url } commits(last:1) { nodes { commit { oid statusCheckRollup { contexts(first:100,after:${JSON.stringify(y)}) { nodes { __typename ... on CheckRun { name status conclusion startedAt completedAt detailsUrl checkSuite { workflowRun { event workflow { name } } } } ... on StatusContext { context state createdAt description targetUrl } } pageInfo { hasNextPage endCursor } } } } } } } }`).join(" ")} }`,
      l = await Le(["api", "graphql", "--hostname", t.hostname, "-f", `query=${a}`], {
        appServerClient: e,
        timeoutMs: 15e3,
      }),
      c;
    try {
      c = ur(l.stdout || "{}", Bqt);
    } catch {
      return o;
    }
    let { data: u, errors: p } = c,
      m = Fqt.safeParse(u?.viewer);
    if (!m.success || m.data.login.toLowerCase() !== t.login.toLowerCase()) return o;
    let f = [];
    for (let h of i) {
      if (p?.some((P) => P.path == null || P.path[0] === `p${h.index}`)) continue;
      let v = $qt.safeParse(u?.[`p${h.index}`]);
      if (!v.success) continue;
      let y = v.data?.pullRequest;
      if (y == null) {
        o[h.index] = { status: "not-found" };
        continue;
      }
      let w = y.commits.nodes[0]?.commit;
      if (
        y.number !== h.pullRequest.number ||
        w?.oid !== y.headRefOid ||
        (h.headRevision != null && h.headRevision !== y.headRefOid)
      )
        continue;
      let _ = w.statusCheckRollup?.contexts,
        S = [...h.checks, ...(_?.nodes ?? [])];
      if (y.state === "OPEN" && _?.pageInfo.hasNextPage) {
        _.pageInfo.endCursor != null &&
          _.pageInfo.endCursor !== h.cursor &&
          f.push({ ...h, checks: S, cursor: _.pageInfo.endCursor, headRevision: y.headRefOid });
        continue;
      }
      let E = y.state === "OPEN",
        T = Up(E ? Tw(S) : []);
      o[h.index] = {
        status: "success",
        baseBranch: y.baseRefName,
        baseRevision: y.baseRefOid,
        checks: T.checks,
        checksComplete: !0,
        ciStatus: T.ciStatus,
        commentCount: y.totalCommentsCount,
        headBranch: y.headRefName,
        hasOpenPr: E,
        hasPendingChecks: T.ciStatus === "pending" || T.checks.some((P) => P.status === "pending"),
        headRepository: y.headRepository == null ? null : yu(y.headRepository.url),
        headRevision: y.headRefOid,
        isDraft: y.isDraft,
        isInMergeQueue: y.isInMergeQueue,
        state: { OPEN: "open", MERGED: "merged", CLOSED: "closed" }[y.state],
        title: y.title,
        url: y.url,
      };
    }
    i = f;
  }
  return o;
}
var Mqt,
  Oqt,
  Nqt,
  I8,
  Lqt,
  Bqt,
  Fqt,
  $qt,
  k8,
  Jqe = g(() => {
    O();
    $();
    Bt();
    vd();
    Tr();
    Yr();
    wo();
    GN();
    FA();
    ((Mqt = 60),
      (Oqt = 20),
      (Nqt = Dt("github")),
      (I8 = new Map()),
      (Lqt = d.object({
        number: d.number(),
        url: d.string(),
        title: d.string(),
        totalCommentsCount: d.number().optional(),
        baseRefName: d.string(),
        headRefName: d.string(),
        state: d.enum(["OPEN", "CLOSED", "MERGED"]),
        isDraft: d.boolean(),
        isInMergeQueue: d.boolean(),
        baseRefOid: d.string(),
        headRefOid: d.string(),
        headRepository: d.object({ url: d.string() }).nullable(),
        commits: d.object({
          nodes: d.array(
            d.object({
              commit: d.object({
                oid: d.string(),
                statusCheckRollup: d
                  .object({
                    contexts: d.object({
                      nodes: d.array(n8.nullable()),
                      pageInfo: d.object({
                        hasNextPage: d.boolean(),
                        endCursor: d.string().nullable(),
                      }),
                    }),
                  })
                  .nullable(),
              }),
            }),
          ),
        }),
      })),
      (Bqt = d.object({
        data: d.record(d.string(), d.unknown()).nullable().optional(),
        errors: d
          .array(d.object({ path: d.array(d.union([d.string(), d.number()])).optional() }))
          .optional(),
      })),
      (Fqt = d.object({ login: d.string() })),
      ($qt = d.object({ pullRequest: Lqt.nullable() }).nullable()));
    k8 = class {
      constructor(e, r) {
        this.account = e;
        this.onIdle = r;
      }
      pending = new Map();
      running = !1;
      read(e, r, n) {
        n?.throwIfAborted();
        let o = JSON.stringify([e.owner.toLowerCase(), e.repository.toLowerCase(), e.number]),
          i = this.pending.get(o);
        if (i == null) {
          let { promise: s, resolve: a } = pt();
          ((i = { pullRequest: e, promise: s, resolve: a, readers: [] }), this.pending.set(o, i));
        }
        return (
          i.readers.push({ host: r, signal: n }),
          this.running || ((this.running = !0), setTimeout(() => void this.flush(), 50)),
          i.promise
        );
      }
      async flush() {
        for (; this.pending.size > 0; ) {
          let e = Array.from(this.pending.entries()).slice(0, Mqt);
          for (let [s] of e) this.pending.delete(s);
          let r = e.filter(([, s]) => s.readers.some(({ signal: a }) => !a?.aborted)),
            n = r[0]?.[1].readers.find(({ signal: s }) => !s?.aborted)?.host,
            o = [];
          try {
            n != null &&
              (o = await Uqt(
                this.account,
                n,
                r.map(([, s]) => s.pullRequest),
                () => r.some(([, s]) => s.readers.some(({ signal: a }) => !a?.aborted)),
              ));
          } catch (s) {
            Nqt.warning("Pull request summary batch failed", { safe: {}, sensitive: { error: s } });
          }
          let i = new Map(r.map(([s], a) => [s, o[a]]));
          for (let [s, a] of e) {
            let l = i.get(s) ?? { status: "unavailable" };
            a.resolve(l);
          }
        }
        ((this.running = !1), this.onIdle());
      }
    };
  });
async function KN({
  allowVideo: t = !1,
  appServerClient: e,
  hostname: r = "github.com",
  maxBytes: n,
  url: o,
}) {
  let i = Vqt(o);
  if (i == null) return null;
  let s = i.kind === "direct" ? i.url : await jqt({ appServerClient: e, gitHubAssetRequest: i });
  if (s == null) return null;
  let a,
    l = new URL(s);
  if (l.hostname !== "private-user-images.githubusercontent.com" || !l.searchParams.has("jwt")) {
    let f = await Le(["auth", "token", "--hostname", r], { appServerClient: e, timeoutMs: 5e3 });
    if (!f.success || f.stdout.length === 0) return null;
    a = f.stdout;
  }
  let c = await zqt({ token: a, url: s });
  if (c == null || !c.ok) return null;
  let u = Number(c.headers.get("content-length"));
  if (n != null && Number.isFinite(u) && u > n) {
    try {
      await c.body?.cancel();
    } catch {}
    return null;
  }
  let p = c.headers.get("content-type")?.split(";")[0]?.trim() ?? null;
  if (
    p?.startsWith("image/") !== !0 &&
    (!t || p?.startsWith("video/") !== !0) &&
    p !== "application/octet-stream"
  )
    return null;
  let m = await Hqt(c, n);
  return m == null || m.length === 0
    ? null
    : {
        contentsBase64: m.toString("base64"),
        mimeType: p === "application/octet-stream" && !t ? null : p,
      };
}
async function Hqt(t, e) {
  if (e == null) return Buffer.from(await t.arrayBuffer());
  if (t.body == null) return null;
  let r = t.body.getReader(),
    n = [],
    o = 0;
  for (;;) {
    let { done: i, value: s } = await r.read();
    if (i) return Buffer.concat(n, o);
    if (!(s instanceof Uint8Array) || ((o += s.byteLength), o > e)) return Qqe(r);
    n.push(s);
  }
}
async function Qqe(t) {
  try {
    await t.cancel();
  } catch {}
  return null;
}
async function jqt({ appServerClient: t, gitHubAssetRequest: e }) {
  let r = await Le(["api", `repos/${e.owner}/${e.repo}/releases/tags/${e.tag}`], {
    appServerClient: t,
    timeoutMs: 5e3,
  });
  if (!r.success) return null;
  let o = ur(r.stdout || "{}", Wqt).assets.find(({ name: i }) => i === e.assetName);
  return o == null ? null : o.url;
}
async function zqt({ token: t, url: e }) {
  try {
    return await Yl(e, {
      headers: {
        Accept: "application/octet-stream",
        ...(t == null ? {} : { Authorization: `Bearer ${t}` }),
      },
    });
  } catch {
    return null;
  }
}
function Vqt(t) {
  let e;
  try {
    e = new URL(t);
  } catch {
    return null;
  }
  if (
    e.protocol !== "https:" ||
    (!qqt.has(e.hostname) && !e.hostname.endsWith(".githubusercontent.com"))
  )
    return null;
  if (e.hostname === "github.com") {
    let [, r, n, o, i] = Gqt.exec(e.pathname) ?? [];
    return r && n && o && i
      ? { kind: "release", assetName: i, owner: r, repo: n, tag: o, url: e.toString() }
      : e.pathname.startsWith("/user-attachments/assets/")
        ? { kind: "direct", url: e.toString() }
        : null;
  }
  return { kind: "direct", url: e.toString() };
}
var qqt,
  Gqt,
  Wqt,
  D8 = g(() => {
    $();
    _u();
    Tr();
    Yr();
    ((qqt = new Set([
      "github.com",
      "raw.githubusercontent.com",
      "user-images.githubusercontent.com",
    ])),
      (Gqt = /^\/([^/]+)\/([^/]+)\/releases\/download\/([^/]+)\/([^/]+)$/),
      (Wqt = d.object({ assets: d.array(d.object({ name: d.string(), url: d.string() })) })));
  });
async function tGe({ account: t, pullRequest: e, url: r }, n) {
  if (!n.isLocal || t.hostId !== n.id || t.hostname.toLowerCase() !== "github.com")
    return { status: "error", error: "GitHub media is unavailable for this account" };
  let o = r,
    i = Kqt(r);
  if (i != null) {
    if (e.hostname !== t.hostname) return { status: "error", error: "GitHub media is unavailable" };
    let a = await Le(
        [
          "api",
          "--hostname",
          t.hostname,
          "markdown",
          "--method",
          "POST",
          "-f",
          `text=![attachment](https://github.com/user-attachments/assets/${i})`,
          "-f",
          "mode=gfm",
          "-f",
          `context=${e.owner}/${e.repository}`,
        ],
        { appServerClient: n, timeoutMs: 3e4 },
      ),
      l = a.success ? (0, eGe.parse)(a.stdout).querySelector("img")?.getAttribute("src") : null;
    if (
      l == null ||
      !/^https:\/\/(?:private-user-images|user-images)\.githubusercontent\.com\//.test(l)
    )
      return { status: "error", error: "GitHub media is unavailable" };
    o = l;
  }
  let s = await KN({
    allowVideo: !0,
    appServerClient: n,
    hostname: t.hostname,
    maxBytes: Fpe,
    url: o,
  });
  return s?.mimeType == null
    ? { status: "error", error: "GitHub media is unavailable" }
    : { status: "success", contentsBase64: s.contentsBase64, mimeType: s.mimeType };
}
function Kqt(t) {
  let e =
    /^https:\/\/github\.com\/user-attachments\/assets\/([\da-f-]{36})(?:[?#].*)?$/i.exec(t)?.[1] ??
    /^https:\/\/private-user-images\.githubusercontent\.com\/\d+\/\d+-([\da-f-]{36})\.[^/?#]+(?:[?#].*)?$/i.exec(
      t,
    )?.[1];
  return e != null && /^[\da-f]{8}(?:-[\da-f]{4}){3}-[\da-f]{12}$/i.test(e) ? e : null;
}
var eGe,
  M8 = g(() => {
    eGe = F(vj());
    O();
    Tr();
    D8();
  });
async function nGe(t, e, r) {
  try {
    let n = zt(t, e);
    return await eGt({
      appServerClient: e,
      pullRequestNumber: n.number,
      query: t.query,
      repo: n.repo,
      scope: t.scope,
      signal: r,
    });
  } catch (n) {
    return { status: "error", error: n instanceof Error ? n.message : String(n) };
  }
}
async function eGt({
  appServerClient: t,
  pullRequestNumber: e,
  query: r,
  repo: n,
  scope: o,
  signal: i,
}) {
  let s = r.trim();
  if ((o === "collaborators" || o === "users") && s.length === 0)
    return { status: "success", users: [] };
  let a = Js(n);
  if (o === "users") {
    let p = [
      "api",
      "--method",
      "GET",
      "search/users",
      "-f",
      `q=${s} in:login`,
      "-f",
      "per_page=10",
    ];
    a?.hostname != null && p.push("--hostname", a.hostname);
    let m = await Le(p, {
      appServerClient: t,
      retrySecondaryRateLimit: !0,
      signal: i,
      timeoutMs: 15e3,
    });
    return m.success
      ? {
          status: "success",
          users: ur(m.stdout, Qqt)
            .items.slice(0, 10)
            .map((h) => ({ avatarUrl: h.avatar_url, login: h.login })),
        }
      : $r(m, "Failed to search GitHub users");
  }
  if (a == null)
    return {
      status: "error",
      error: `No GitHub repository found for ${o === "collaborators" ? "collaborator" : "mention"} search`,
    };
  let l = [
    "api",
    "graphql",
    "-f",
    `query=${o === "collaborators" ? Zqt : Xqt}`,
    "-f",
    `search=${s}`,
    "-f",
    `owner=${a.owner}`,
    "-f",
    `repo=${a.repo}`,
  ];
  (o === "mentions" && l.push("-F", `number=${e}`),
    a.hostname != null && l.push("--hostname", a.hostname));
  let c = await Le(l, {
    appServerClient: t,
    retrySecondaryRateLimit: !0,
    signal: i,
    timeoutMs: 15e3,
  });
  if (!c.success) return $r(c, "Failed to search GitHub users");
  if (o === "mentions") {
    let p = ur(c.stdout, Jqt),
      m = s.toLowerCase(),
      { mentionableUsers: f, pullRequest: h } = p.data.repository,
      v = (0, rGe.default)(
        [
          ...h.participants.nodes.filter(({ login: y }) => y.toLowerCase().includes(m)),
          ...(s.length === 0 ? [] : f.nodes),
        ],
        ({ login: y }) => y.toLowerCase(),
      );
    return { status: "success", users: s.length === 0 ? v : v.slice(0, 10) };
  }
  let u = ur(c.stdout, Yqt);
  return {
    status: "success",
    users: u.data.repository.collaborators.edges
      .filter(({ node: p }) => p.login.toLowerCase() !== u.data.viewer.login.toLowerCase())
      .map(({ node: p }) => ({ avatarUrl: p.avatarUrl, login: p.login })),
  };
}
var rGe,
  Zqt,
  Xqt,
  O8,
  Yqt,
  Jqt,
  Qqt,
  N8 = g(() => {
    rGe = F(kA());
    $();
    Tr();
    Yr();
    wo();
    ((Zqt =
      "query($owner:String!,$repo:String!,$search:String!){viewer{login} repository(owner:$owner,name:$repo){collaborators(first:100,query:$search){edges{node{avatarUrl(size:48) login}}}}}"),
      (Xqt =
        "query($owner:String!,$repo:String!,$number:Int!,$search:String!){repository(owner:$owner,name:$repo){mentionableUsers(first:10,query:$search){nodes{avatarUrl(size:48) login}} pullRequest(number:$number){participants(first:100){nodes{avatarUrl(size:48) login}}}}}"),
      (O8 = d.object({ avatarUrl: d.string(), login: d.string() })),
      (Yqt = d.object({
        data: d.object({
          viewer: d.object({ login: d.string() }),
          repository: d.object({
            collaborators: d.object({ edges: d.array(d.object({ node: O8 })) }),
          }),
        }),
      })),
      (Jqt = d.object({
        data: d.object({
          repository: d.object({
            mentionableUsers: d.object({ nodes: d.array(O8) }),
            pullRequest: d.object({ participants: d.object({ nodes: d.array(O8) }) }),
          }),
        }),
      })),
      (Qqt = d.object({
        items: d.array(d.object({ avatar_url: d.string(), login: d.string() })),
      })));
  });
async function sGe({
  account: t,
  appServerClient: e,
  cursor: r,
  filters: n,
  pageSize: o,
  signal: i,
}) {
  if (t.hostId !== e.id) throw new RangeError("Pull request account does not match the host");
  uGt(n, o);
  let a = (
      await aGt({
        account: t,
        appServerClient: e,
        cursor: r,
        pageSize: o,
        searchQuery: sGt(n),
        signal: i,
      })
    ).data.search,
    l = (0, iGe.default)(
      a.nodes.flatMap((p) => (p == null ? [] : [lGt(p, t)])),
      "nodeId",
    ),
    c = a.pageInfo.endCursor != null && a.pageInfo.endCursor !== r && l.length > 0,
    u = a.pageInfo.hasNextPage && c;
  return {
    endCursor: u ? a.pageInfo.endCursor : null,
    hasNextPage: u,
    items: l,
    totalCount: a.issueCount,
    truncated: a.issueCount > tGt || (a.pageInfo.hasNextPage && !c),
  };
}
function sGt(t) {
  let e = t.rawQuery?.trim(),
    { qualifierNames: r, unquotedQuery: n } = Wpe(e ?? ""),
    o = ["is:pr", ...(r.includes("archived") ? [] : ["archived:false"])];
  switch (t.relationship) {
    case "all":
      break;
    case "authored":
      o.push("author:@me");
      break;
    case "review_requested":
      o.push("review-requested:@me");
      break;
    case "reviewed":
      o.push("reviewed-by:@me");
      break;
    case "user_review_requested":
      o.push("user-review-requested:@me");
      break;
  }
  switch (t.lifecycle) {
    case "all":
      break;
    case "open":
      o.push("is:open");
      break;
    case "merged":
      o.push("is:merged");
      break;
    case "closed":
      o.push("is:closed", "is:unmerged");
      break;
  }
  if (
    (t.repository != null && o.push(`repo:${t.repository.owner}/${t.repository.repository}`),
    e != null && e.length > 0)
  )
    o.push(e);
  else {
    let i = t.text.replaceAll(/\s+/g, " ").trim();
    i.length > 0 && o.push(`"${i.replaceAll("\\", "\\\\").replaceAll('"', '\\"')}"`);
  }
  return ((e == null || !/(?:^|[\s(])sort:/iu.test(n)) && o.push("sort:updated-desc"), o.join(" "));
}
async function aGt({
  account: t,
  appServerClient: e,
  cursor: r,
  pageSize: n,
  searchQuery: o,
  signal: i,
}) {
  let s = [
    "api",
    "graphql",
    "-f",
    `query=${iGt}`,
    "-f",
    `searchQuery=${o}`,
    "-F",
    `first=${n}`,
    "--hostname",
    t.hostname,
  ];
  r != null && s.push("-f", `after=${r}`);
  let a = await Le(s, {
    appServerClient: e,
    retrySecondaryRateLimit: !0,
    signal: i,
    timeoutMs: 3e4,
  });
  if (!a.success) throw new Error(hi(a, "Failed to search pull requests"));
  return ur(a.stdout || "{}", IUe);
}
function lGt(t, e) {
  let r = cGt(t.state),
    n = t.statusCheckRollup?.contexts,
    o = r === "open" ? Up(Tw(n?.nodes)).ciStatus : "none";
  r === "open" && n != null && n.totalCount > n.nodes.length && o !== "failing" && (o = "pending");
  let i =
    r === "open" &&
    qp({
      hasOpenPr: !0,
      isDraft: t.isDraft,
      mergeStateStatus: t.mergeStateStatus,
      mergeable: t.mergeable,
    });
  return {
    additions: t.additions,
    ...(t.author?.avatarUrl != null ? { authorAvatarUrl: t.author.avatarUrl } : {}),
    authorLogin: t.author?.login ?? null,
    baseBranch: t.baseRefName,
    canMerge: i,
    ciStatus: o,
    createdAt: t.createdAt,
    deletions: t.deletions,
    hasDiffStats: !0,
    headBranch: t.headRefName,
    isAuthor: t.author?.login?.toLowerCase() === e.login.toLowerCase(),
    isDraft: t.isDraft,
    mergeBlocker:
      r === "open" ? Gp({ mergeStateStatus: t.mergeStateStatus, mergeable: t.mergeable }) : null,
    nodeId: t.id,
    pullRequest: {
      hostname: e.hostname,
      number: t.number,
      owner: t.repository.owner.login,
      repository: t.repository.name,
    },
    state: r,
    title: t.title,
    updatedAt: t.updatedAt,
    url: t.url,
  };
}
function cGt(t) {
  switch (t) {
    case "OPEN":
      return "open";
    case "CLOSED":
      return "closed";
    case "MERGED":
      return "merged";
  }
}
function uGt(t, e) {
  if (!Number.isInteger(e) || e < 1 || e > rGt)
    throw new RangeError("Pull request search page size is invalid");
  if (t.text.length > nGt || (t.rawQuery?.length ?? 0) > oGt)
    throw new RangeError("Pull request search text is too long");
  if (t.repository != null && (!oGe.test(t.repository.owner) || !oGe.test(t.repository.repository)))
    throw new RangeError("Pull request repository filter is invalid");
}
var iGe,
  tGt,
  rGt,
  nGt,
  oGt,
  oGe,
  iGt,
  L8 = g(() => {
    iGe = F(kA());
    O();
    vd();
    Tr();
    Yr();
    GN();
    FA();
    ((tGt = 1e3),
      (rGt = 100),
      (nGt = 256),
      (oGt = 1024),
      (oGe = /^[A-Za-z0-9_.-]+$/),
      (iGt = `
  query($searchQuery: String!, $first: Int!, $after: String) {
    search(query: $searchQuery, type: ISSUE, first: $first, after: $after) {
      issueCount
      nodes {
        __typename
        ... on PullRequest {
          additions
          author {
            avatarUrl(size: 48)
            login
          }
          baseRefName
          createdAt
          deletions
          headRefName
          id
          isDraft
          mergeStateStatus
          mergeable
          number
          repository {
            name
            owner {
              login
            }
          }
          state
          statusCheckRollup {
            contexts(first: 100) {
              totalCount
              nodes {
                __typename
                ... on CheckRun {
                  checkSuite {
                    workflowRun {
                      workflow {
                        name
                      }
                    }
                  }
                  conclusion
                  name
                  startedAt
                  status
                }
                ... on StatusContext {
                  context
                  createdAt
                  state
                }
              }
            }
          }
          title
          updatedAt
          url
        }
      }
      pageInfo {
        endCursor
        hasNextPage
      }
    }
  }
`));
  });
async function aGe(t, e) {
  try {
    let r = zt(t, e),
      n = Js(r.repo);
    if (n == null)
      return { status: "error", error: "Repository is required for pull request reviews" };
    let o = t.expectedHeadRevision.trim();
    if (o.length === 0)
      return { status: "error", error: "Expected pull request head revision is required" };
    let i = t.body?.trim() ?? "";
    if (t.pendingReviewId == null && t.event !== "approve" && i.length === 0)
      return { status: "error", error: "Review body is required" };
    if ((await Cn(e, void 0, r.hostname), t.pendingReviewId != null))
      return (await MUe(t, e), { status: "success" });
    let s = await of({ appServerClient: e, number: r.number, repo: r.repo });
    if (s.status === "error") return s;
    if (s.headRevision !== o)
      return {
        status: "error",
        error: "Pull request head changed; refresh before submitting a review",
      };
    let a = await Le(
      [
        "api",
        `repos/${n.owner}/${n.repo}/pulls/${r.number}/reviews`,
        "--method",
        "POST",
        "-f",
        `commit_id=${o}`,
        "-f",
        `event=${dGt(t.event)}`,
        ...(i.length === 0 ? [] : ["-f", `body=${i}`]),
        ...(n.hostname == null ? [] : ["--hostname", n.hostname]),
      ],
      { appServerClient: e, timeoutMs: 15e3 },
    );
    return a.success ? { status: "success" } : $r(a, "Failed to submit pull request review");
  } catch (r) {
    return { status: "error", error: r instanceof Error ? r.message : String(r) };
  }
}
function dGt(t) {
  switch (t) {
    case "approve":
      return "APPROVE";
    case "comment":
      return "COMMENT";
    case "request_changes":
      return "REQUEST_CHANGES";
  }
}
var B8 = g(() => {
  gi();
  FN();
  Tr();
  Yr();
  $N();
  wo();
});
async function lGe(t, e, r) {
  try {
    let n = zt(t, e),
      o = t.nodeId.trim();
    if (o.length === 0) return { status: "error", error: "Comment ID is required" };
    if (t.action === "update" && t.body.trim().length === 0)
      return { status: "error", error: "Comment body is required" };
    if (
      (await Cn(e, r, n.hostname),
      t.pendingReviewId != null && (await NUe(t, e)),
      t.action === "update" && t.expectedBody != null)
    ) {
      let l = await Le(
        [
          "api",
          "graphql",
          "-f",
          `query=query($id:ID!){node(id:$id){... on ${fGt[t.commentType]}{body}}}`,
          "-F",
          `id=${o}`,
          "--hostname",
          n.hostname,
        ],
        { appServerClient: e, signal: r, timeoutMs: 15e3 },
      );
      if (!l.success) return $r(l, "Failed to read current comment");
      let { data: c } = ur(l.stdout, hGt);
      if (c.node?.body !== t.expectedBody)
        return { status: "error", error: "Comment changed; refresh before trying again" };
    }
    let i;
    if (t.action === "update") i = pGt[t.commentType];
    else {
      if (t.commentType === "review") return (await OUe(t, e), { status: "success" });
      i = mGt[t.commentType];
    }
    let s = [
      "api",
      "graphql",
      "-f",
      `query=mutation($id:ID!${t.action === "update" ? ",$body:String!" : ""}){${i}}`,
      "-F",
      `id=${o}`,
    ];
    (t.action === "update" && s.push("-f", `body=${t.body}`), s.push("--hostname", n.hostname));
    let a = await Le(s, { appServerClient: e, signal: r, timeoutMs: 15e3 });
    return a.success
      ? { status: "success" }
      : $r(
          a,
          t.action === "update"
            ? "Failed to update pull request comment"
            : "Failed to delete pull request comment",
        );
  } catch (n) {
    return { status: "error", error: n instanceof Error ? n.message : String(n) };
  }
}
var pGt,
  mGt,
  fGt,
  hGt,
  cGe = g(() => {
    $();
    gi();
    Tr();
    Yr();
    $N();
    wo();
    ((pGt = {
      comment: "updateIssueComment(input:{id:$id,body:$body}){issueComment{id}}",
      review:
        "updatePullRequestReview(input:{pullRequestReviewId:$id,body:$body}){pullRequestReview{id}}",
      review_comment:
        "updatePullRequestReviewComment(input:{pullRequestReviewCommentId:$id,body:$body}){pullRequestReviewComment{id}}",
    }),
      (mGt = {
        comment: "deleteIssueComment(input:{id:$id}){clientMutationId}",
        review_comment: "deletePullRequestReviewComment(input:{id:$id}){clientMutationId}",
      }),
      (fGt = {
        comment: "IssueComment",
        review: "PullRequestReview",
        review_comment: "PullRequestReviewComment",
      }),
      (hGt = d.object({ data: d.object({ node: d.object({ body: d.string() }).nullable() }) })));
  });
async function uGe(t, e, r) {
  try {
    let n = zt(t, e),
      o = t.reviewThreadId.trim();
    if (o.length === 0) return { status: "error", error: "Review thread ID is required" };
    await Cn(e, r, n.hostname);
    let i = t.action === "resolve" ? "resolveReviewThread" : "unresolveReviewThread",
      s = await Le(
        [
          "api",
          "graphql",
          "-f",
          `query=mutation($threadId:ID!){${i}(input:{threadId:$threadId}){thread{id isResolved}}}`,
          "-F",
          `threadId=${o}`,
          "--hostname",
          n.hostname,
        ],
        { appServerClient: e, signal: r, timeoutMs: 15e3 },
      );
    return s.success
      ? { status: "success" }
      : $r(
          s,
          t.action === "resolve"
            ? "Failed to resolve pull request review thread"
            : "Failed to unresolve pull request review thread",
        );
  } catch (n) {
    return { status: "error", error: n instanceof Error ? n.message : String(n) };
  }
}
