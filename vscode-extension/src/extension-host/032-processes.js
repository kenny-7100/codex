function DOt() {
  return {
    context: void 0,
    data: void 0,
    error: null,
    failureCount: 0,
    failureReason: null,
    isPaused: !1,
    status: "idle",
    variables: void 0,
    submittedAt: 0,
  };
}
var nNe,
  oNe = g(() => {
    Hy();
    U3();
    uO();
    nNe = class extends dO {
      #e;
      #t;
      #r;
      #n;
      constructor(t) {
        (super(),
          (this.#e = t.client),
          (this.mutationId = t.mutationId),
          (this.#r = t.mutationCache),
          (this.#t = []),
          (this.state = t.state || DOt()),
          this.setOptions(t.options),
          this.scheduleGc());
      }
      setOptions(t) {
        ((this.options = t), this.updateGcTime(this.options.gcTime));
      }
      get meta() {
        return this.options.meta;
      }
      addObserver(t) {
        this.#t.includes(t) ||
          (this.#t.push(t),
          this.clearGcTimeout(),
          this.#r.notify({ type: "observerAdded", mutation: this, observer: t }));
      }
      removeObserver(t) {
        ((this.#t = this.#t.filter((e) => e !== t)),
          this.scheduleGc(),
          this.#r.notify({ type: "observerRemoved", mutation: this, observer: t }));
      }
      optionalRemove() {
        this.#t.length ||
          (this.state.status === "pending" ? this.scheduleGc() : this.#r.remove(this));
      }
      continue() {
        return this.#n?.continue() ?? this.execute(this.state.variables);
      }
      async execute(t) {
        let e = () => {
            this.#i({ type: "continue" });
          },
          r = { client: this.#e, meta: this.options.meta, mutationKey: this.options.mutationKey };
        this.#n = cO({
          fn: () =>
            this.options.mutationFn
              ? this.options.mutationFn(t, r)
              : Promise.reject(new Error("No mutationFn found")),
          onFail: (i, s) => {
            this.#i({ type: "failed", failureCount: i, error: s });
          },
          onPause: () => {
            this.#i({ type: "pause" });
          },
          onContinue: e,
          retry: this.options.retry ?? 0,
          retryDelay: this.options.retryDelay,
          networkMode: this.options.networkMode,
          canRun: () => this.#r.canRun(this),
        });
        let n = this.state.status === "pending",
          o = !this.#n.canStart();
        try {
          if (n) e();
          else {
            (this.#i({ type: "pending", variables: t, isPaused: o }),
              this.#r.config.onMutate && (await this.#r.config.onMutate(t, this, r)));
            let s = await this.options.onMutate?.(t, r);
            s !== this.state.context &&
              this.#i({ type: "pending", context: s, variables: t, isPaused: o });
          }
          let i = await this.#n.start();
          return (
            await this.#r.config.onSuccess?.(i, t, this.state.context, this, r),
            await this.options.onSuccess?.(i, t, this.state.context, r),
            await this.#r.config.onSettled?.(
              i,
              null,
              this.state.variables,
              this.state.context,
              this,
              r,
            ),
            await this.options.onSettled?.(i, null, t, this.state.context, r),
            this.#i({ type: "success", data: i }),
            i
          );
        } catch (i) {
          try {
            await this.#r.config.onError?.(i, t, this.state.context, this, r);
          } catch (s) {
            Promise.reject(s);
          }
          try {
            await this.options.onError?.(i, t, this.state.context, r);
          } catch (s) {
            Promise.reject(s);
          }
          try {
            await this.#r.config.onSettled?.(
              void 0,
              i,
              this.state.variables,
              this.state.context,
              this,
              r,
            );
          } catch (s) {
            Promise.reject(s);
          }
          try {
            await this.options.onSettled?.(void 0, i, t, this.state.context, r);
          } catch (s) {
            Promise.reject(s);
          }
          throw (this.#i({ type: "error", error: i }), i);
        } finally {
          this.#r.runNext(this);
        }
      }
      #i(t) {
        let e = (r) => {
          switch (t.type) {
            case "failed":
              return { ...r, failureCount: t.failureCount, failureReason: t.error };
            case "pause":
              return { ...r, isPaused: !0 };
            case "continue":
              return { ...r, isPaused: !1 };
            case "pending":
              return {
                ...r,
                context: t.context,
                data: void 0,
                failureCount: 0,
                failureReason: null,
                error: null,
                isPaused: t.isPaused,
                status: "pending",
                variables: t.variables,
                submittedAt: Date.now(),
              };
            case "success":
              return {
                ...r,
                data: t.data,
                failureCount: 0,
                failureReason: null,
                error: null,
                status: "success",
                isPaused: !1,
              };
            case "error":
              return {
                ...r,
                data: void 0,
                error: t.error,
                failureCount: r.failureCount + 1,
                failureReason: t.error,
                isPaused: !1,
                status: "error",
              };
          }
        };
        ((this.state = e(this.state)),
          mn.batch(() => {
            (this.#t.forEach((r) => {
              r.onMutationUpdate(t);
            }),
              this.#r.notify({ mutation: this, type: "updated", action: t }));
          }));
      }
    };
  });
function pO(t) {
  return t.options.scope?.id;
}
var iNe,
  sNe = g(() => {
    Hy();
    oNe();
    rl();
    Zx();
    iNe = class extends ed {
      constructor(t = {}) {
        (super(), (this.config = t), (this.#e = new Set()), (this.#t = new Map()), (this.#r = 0));
      }
      #e;
      #t;
      #r;
      build(t, e, r) {
        let n = new nNe({
          client: t,
          mutationCache: this,
          mutationId: ++this.#r,
          options: t.defaultMutationOptions(e),
          state: r,
        });
        return (this.add(n), n);
      }
      add(t) {
        this.#e.add(t);
        let e = pO(t);
        if (typeof e == "string") {
          let r = this.#t.get(e);
          r ? r.push(t) : this.#t.set(e, [t]);
        }
        this.notify({ type: "added", mutation: t });
      }
      remove(t) {
        if (this.#e.delete(t)) {
          let e = pO(t);
          if (typeof e == "string") {
            let r = this.#t.get(e);
            if (r)
              if (r.length > 1) {
                let n = r.indexOf(t);
                n !== -1 && r.splice(n, 1);
              } else r[0] === t && this.#t.delete(e);
          }
        }
        this.notify({ type: "removed", mutation: t });
      }
      canRun(t) {
        let e = pO(t);
        if (typeof e == "string") {
          let n = this.#t.get(e)?.find((o) => o.state.status === "pending");
          return !n || n === t;
        } else return !0;
      }
      runNext(t) {
        let e = pO(t);
        return typeof e == "string"
          ? (this.#t
              .get(e)
              ?.find((n) => n !== t && n.state.isPaused)
              ?.continue() ?? Promise.resolve())
          : Promise.resolve();
      }
      clear() {
        mn.batch(() => {
          (this.#e.forEach((t) => {
            this.notify({ type: "removed", mutation: t });
          }),
            this.#e.clear(),
            this.#t.clear());
        });
      }
      getAll() {
        return Array.from(this.#e);
      }
      find(t) {
        let e = { exact: !0, ...t };
        return this.getAll().find((r) => sO(e, r));
      }
      findAll(t = {}) {
        return this.getAll().filter((e) => sO(t, e));
      }
      notify(t) {
        mn.batch(() => {
          this.listeners.forEach((e) => {
            e(t);
          });
        });
      }
      resumePausedMutations() {
        let t = this.getAll().filter((e) => e.state.isPaused);
        return mn.batch(() => Promise.all(t.map((e) => e.continue().catch($o))));
      }
    };
  });
var aNe,
  lNe = g(() => {
    rl();
    rNe();
    Hy();
    Zx();
    aNe = class extends ed {
      constructor(t = {}) {
        (super(), (this.config = t), (this.#e = new Map()));
      }
      #e;
      build(t, e, r) {
        let n = e.queryKey,
          o = e.queryHash ?? Jx(n, e),
          i = this.get(o);
        return (
          i ||
            ((i = new tNe({
              client: t,
              queryKey: n,
              queryHash: o,
              options: t.defaultQueryOptions(e),
              state: r,
              defaultOptions: t.getQueryDefaults(n),
            })),
            this.add(i)),
          i
        );
      }
      add(t) {
        this.#e.has(t.queryHash) ||
          (this.#e.set(t.queryHash, t), this.notify({ type: "added", query: t }));
      }
      remove(t) {
        let e = this.#e.get(t.queryHash);
        e &&
          (t.destroy(),
          e === t && this.#e.delete(t.queryHash),
          this.notify({ type: "removed", query: t }));
      }
      clear() {
        mn.batch(() => {
          this.getAll().forEach((t) => {
            this.remove(t);
          });
        });
      }
      get(t) {
        return this.#e.get(t);
      }
      getAll() {
        return [...this.#e.values()];
      }
      find(t) {
        let e = { exact: !0, ...t };
        return this.getAll().find((r) => iO(e, r));
      }
      findAll(t = {}) {
        let e = this.getAll();
        return Object.keys(t).length > 0 ? e.filter((r) => iO(t, r)) : e;
      }
      notify(t) {
        mn.batch(() => {
          this.listeners.forEach((e) => {
            e(t);
          });
        });
      }
      onFocus() {
        mn.batch(() => {
          this.getAll().forEach((t) => {
            t.onFocus();
          });
        });
      }
      onOnline() {
        mn.batch(() => {
          this.getAll().forEach((t) => {
            t.onOnline();
          });
        });
      }
    };
  });
var q3,
  cNe = g(() => {
    rl();
    lNe();
    sNe();
    O3();
    F3();
    Hy();
    q3 = class {
      #e;
      #t;
      #r;
      #n;
      #i;
      #o;
      #s;
      #a;
      constructor(t = {}) {
        ((this.#e = t.queryCache || new aNe()),
          (this.#t = t.mutationCache || new iNe()),
          (this.#r = t.defaultOptions || {}),
          (this.#n = new Map()),
          (this.#i = new Map()),
          (this.#o = 0));
      }
      mount() {
        (this.#o++,
          this.#o === 1 &&
            ((this.#s = rO.subscribe(async (t) => {
              t && (await this.resumePausedMutations(), this.#e.onFocus());
            })),
            (this.#a = jy.subscribe(async (t) => {
              t && (await this.resumePausedMutations(), this.#e.onOnline());
            }))));
      }
      unmount() {
        (this.#o--,
          this.#o === 0 && (this.#s?.(), (this.#s = void 0), this.#a?.(), (this.#a = void 0)));
      }
      isFetching(t) {
        return this.#e.findAll({ ...t, fetchStatus: "fetching" }).length;
      }
      isMutating(t) {
        return this.#t.findAll({ ...t, status: "pending" }).length;
      }
      getQueryData(t) {
        let e = this.defaultQueryOptions({ queryKey: t });
        return this.#e.get(e.queryHash)?.state.data;
      }
      ensureQueryData(t) {
        let e = this.defaultQueryOptions(t),
          r = this.#e.build(this, e),
          n = r.state.data;
        return n === void 0
          ? this.fetchQuery(t)
          : (t.revalidateIfStale && r.isStaleByTime(Yx(e.staleTime, r)) && this.prefetchQuery(e),
            Promise.resolve(n));
      }
      getQueriesData(t) {
        return this.#e.findAll(t).map(({ queryKey: e, state: r }) => {
          let n = r.data;
          return [e, n];
        });
      }
      setQueryData(t, e, r) {
        let n = this.defaultQueryOptions({ queryKey: t }),
          i = this.#e.get(n.queryHash)?.state.data,
          s = $Oe(e, i);
        if (s !== void 0) return this.#e.build(this, n).setData(s, { ...r, manual: !0 });
      }
      setQueriesData(t, e, r) {
        return mn.batch(() =>
          this.#e.findAll(t).map(({ queryKey: n }) => [n, this.setQueryData(n, e, r)]),
        );
      }
      getQueryState(t) {
        let e = this.defaultQueryOptions({ queryKey: t });
        return this.#e.get(e.queryHash)?.state;
      }
      removeQueries(t) {
        let e = this.#e;
        mn.batch(() => {
          e.findAll(t).forEach((r) => {
            e.remove(r);
          });
        });
      }
      resetQueries(t, e) {
        let r = this.#e;
        return mn.batch(
          () => (
            r.findAll(t).forEach((n) => {
              n.reset();
            }),
            this.refetchQueries({ type: "active", ...t }, e)
          ),
        );
      }
      cancelQueries(t, e = {}) {
        let r = { revert: !0, ...e },
          n = mn.batch(() => this.#e.findAll(t).map((o) => o.cancel(r)));
        return Promise.all(n).then($o).catch($o);
      }
      invalidateQueries(t, e = {}) {
        return mn.batch(
          () => (
            this.#e.findAll(t).forEach((r) => {
              r.invalidate();
            }),
            t?.refetchType === "none"
              ? Promise.resolve()
              : this.refetchQueries({ ...t, type: t?.refetchType ?? t?.type ?? "active" }, e)
          ),
        );
      }
      refetchQueries(t, e = {}) {
        let r = { ...e, cancelRefetch: e.cancelRefetch ?? !0 },
          n = mn.batch(() =>
            this.#e
              .findAll(t)
              .filter((o) => !o.isDisabled() && !o.isStatic())
              .map((o) => {
                let i = o.fetch(void 0, r);
                return (
                  r.throwOnError || (i = i.catch($o)),
                  o.state.fetchStatus === "paused" ? Promise.resolve() : i
                );
              }),
          );
        return Promise.all(n).then($o);
      }
      fetchQuery(t) {
        let e = this.defaultQueryOptions(t);
        e.retry === void 0 && (e.retry = !1);
        let r = this.#e.build(this, e);
        return r.isStaleByTime(Yx(e.staleTime, r)) ? r.fetch(e) : Promise.resolve(r.state.data);
      }
      prefetchQuery(t) {
        return this.fetchQuery(t).then($o).catch($o);
      }
      fetchInfiniteQuery(t) {
        return ((t._type = "infinite"), this.fetchQuery(t));
      }
      prefetchInfiniteQuery(t) {
        return this.fetchInfiniteQuery(t).then($o).catch($o);
      }
      ensureInfiniteQueryData(t) {
        return ((t._type = "infinite"), this.ensureQueryData(t));
      }
      resumePausedMutations() {
        return jy.isOnline() ? this.#t.resumePausedMutations() : Promise.resolve();
      }
      getQueryCache() {
        return this.#e;
      }
      getMutationCache() {
        return this.#t;
      }
      getDefaultOptions() {
        return this.#r;
      }
      setDefaultOptions(t) {
        this.#r = t;
      }
      setQueryDefaults(t, e) {
        this.#n.set(bc(t), { queryKey: t, defaultOptions: e });
      }
      getQueryDefaults(t) {
        let e = [...this.#n.values()],
          r = {};
        return (
          e.forEach((n) => {
            qm(t, n.queryKey) && Object.assign(r, n.defaultOptions);
          }),
          r
        );
      }
      setMutationDefaults(t, e) {
        this.#i.set(bc(t), { mutationKey: t, defaultOptions: e });
      }
      getMutationDefaults(t) {
        let e = [...this.#i.values()],
          r = {};
        return (
          e.forEach((n) => {
            qm(t, n.mutationKey) && Object.assign(r, n.defaultOptions);
          }),
          r
        );
      }
      defaultQueryOptions(t) {
        if (t._defaulted) return t;
        let e = { ...this.#r.queries, ...this.getQueryDefaults(t.queryKey), ...t, _defaulted: !0 };
        return (
          e.queryHash || (e.queryHash = Jx(e.queryKey, e)),
          e.refetchOnReconnect === void 0 && (e.refetchOnReconnect = e.networkMode !== "always"),
          e.throwOnError === void 0 && (e.throwOnError = !!e.suspense),
          !e.networkMode && e.persister && (e.networkMode = "offlineFirst"),
          e.queryFn === Um && (e.enabled = !1),
          e
        );
      }
      defaultMutationOptions(t) {
        return t?._defaulted
          ? t
          : {
              ...this.#r.mutations,
              ...(t?.mutationKey && this.getMutationDefaults(t.mutationKey)),
              ...t,
              _defaulted: !0,
            };
      }
      clear() {
        (this.#e.clear(), this.#t.clear());
      }
    };
  });
var uNe = g(() => {});
var G3 = g(() => {
  cNe();
  uO();
  rl();
  uNe();
});
function fn(t) {
  return t.id;
}
var Qx = g(() => {});
function hNe() {
  return new q3({ defaultOptions: { queries: { gcTime: 1 / 0, retry: !1 } } });
}
function ne(t, e, r, ...n) {
  return ["git", fn(e), t, r, ...n];
}
function Er(t, e, r) {
  if (r?.aborted) return Promise.reject(new Error("Git query aborted"));
  let n = di(),
    o = dNe.get(t);
  o == null && ((o = new Map()), dNe.set(t, o));
  let i = bc(e.queryKey),
    s = o.get(i);
  (s == null || s.abortController.signal.aborted) &&
    ((s = { abortController: new AbortController(), consumers: new GM() }), o.set(i, s));
  let a = s,
    l = n.isLateTurnGitCapture === !0,
    c = a.consumers.add(l),
    u = (h) => {
      (c(),
        a.consumers.hasRetainingConsumers ||
          (h && a.abortController.abort(), o.get(i) === a && o.delete(i)));
    },
    p = () => {
      let h = o.get(i) === a;
      (u(!0),
        h &&
          !a.consumers.hasRetainingConsumers &&
          t.removeQueries({ queryKey: e.queryKey, exact: !0 }));
    };
  (r?.addEventListener("abort", p, { once: !0 }), r?.aborted && p());
  let m = t.defaultQueryOptions({
      queryKey: e.queryKey,
      gcTime: e.gcTime,
      meta: e.meta,
      queryFn: () => e.queryFn(a.abortController.signal),
      staleTime: e.staleTime,
    }),
    f = Ui(
      () => t.fetchQuery(m),
      () => t.getQueryCache().get(m.queryHash)?.promise,
      a.consumers,
    ).finally(() => {
      (r?.removeEventListener("abort", p), u(!1));
    });
  return l
    ? f.catch((h) => {
        if (a.abortController.signal.aborted && !r?.aborted) return Er(t, e, r);
        throw h;
      })
    : f;
}
function hO(t, e, r) {
  let n = Er(t, e, r);
  return r == null ? n : Lt(n, r);
}
function W3(t, e) {
  gO(t, (r) => r.meta?.gitReadInvalidation === Ue.gitReadInvalidation && MOt(r.queryKey, e));
}
function gNe(t) {
  t.removeQueries({
    predicate: (e) => e.meta?.gitReadWatchScoped === !0 && e.state.fetchStatus !== "fetching",
  });
}
function H3(t, e, r, n) {
  gO(t, (o) => {
    let i = o.meta?.gitReadInvalidation;
    return i === Ue.gitReadInvalidation
      ? (r !== "local-refs" || o.meta?.gitReadLocalRefs === !0) && mO(e, o.meta?.gitReadPaths, n)
      : !Array.isArray(i) || !i.includes(r)
        ? !1
        : mO(e, o.meta?.gitReadPaths, n);
  });
}
function gO(t, e) {
  (t.invalidateQueries({ predicate: e, refetchType: "none" }),
    t.removeQueries({
      type: "inactive",
      fetchStatus: "idle",
      predicate: (r) => r.state.isInvalidated && e(r),
    }));
}
function MOt(t, e) {
  return t[0] === "git" && (e == null || t[1] === fn(e));
}
function mO(t, e, r) {
  if (!Array.isArray(e) || r == null) return !0;
  let n = pNe(t);
  return r.some((o) => {
    let i = pNe(o),
      s = i.startsWith(`${n}/`) ? i.slice(n.length + 1) : i;
    return e.some((a) =>
      typeof a != "string" ? !1 : s === a || s.startsWith(`${a}/`) || a.startsWith(`${s}/`),
    );
  });
}
function pNe(t) {
  return t.replaceAll("\\", "/").replace(/\/+$/, "");
}
var be,
  Ve,
  Ue,
  fO,
  pi,
  mNe,
  zy,
  Vy,
  eA,
  fNe,
  dNe,
  je = g(() => {
    G3();
    O();
    Qu();
    Qx();
    Oy();
    ((be = 250),
      (Ve = 1 / 0),
      (Ue = { gitReadInvalidation: "short-lived" }),
      (fO = { ...Ue, gitReadLocalRefs: !0 }),
      (pi = { gitReadInvalidation: ["config"] }),
      (mNe = { gitReadInvalidation: ["head"] }),
      (zy = { gitReadInvalidation: ["head", "index", "local-refs", "remote-refs"] }),
      (Vy = {
        gitReadInvalidation: ["config", "head", "local-refs", "remote-refs"],
        gitReadWatchScoped: !0,
      }),
      (eA = { gitReadInvalidation: ["config", "remote-refs"] }),
      (fNe = { gitReadInvalidation: ["working-tree"], gitReadPaths: [".gitmodules"] }),
      (dNe = new WeakMap()));
  });
function us(t, e) {
  return t.queryClient.fetchQuery({
    queryKey: ne(t.root, t.host, "git-dir"),
    queryFn: async () => {
      let { success: r, stdout: n } = await I(t.root, ["rev-parse", "--git-dir"], t.host, {
        signal: e,
      });
      if (!r || !n) return null;
      let o = await t.host.platformPath();
      return o.isAbsolute(n) ? n : o.join(t.root, n);
    },
    staleTime: (r) => (r.state.data == null ? be : Ve),
  });
}
var Wm = g(() => {
  je();
  fe();
});
function nl(t, e, r) {
  return t.queryClient.fetchQuery({
    queryKey: ne(t.root, t.host, "git-path", e),
    queryFn: async () => {
      let { success: n, stdout: o } = await I(t.root, ["rev-parse", "--git-path", e], t.host, {
        signal: r,
      });
      if (!n || !o) return null;
      let i = await t.host.platformPath();
      if (i.isAbsolute(o)) return o;
      if (o.startsWith(".git/")) return i.join(t.root, o);
      let s = await us(t, r);
      return s ? i.join(s, o) : null;
    },
    staleTime: (n) => (n.state.data == null ? be : Ve),
  });
}
var Ky = g(() => {
  Wm();
  je();
  fe();
});
async function Hm(t) {
  return nl(t, "index");
}
var tA = g(() => {
  Ky();
});
async function ol(t, e) {
  let r = await Hm(t);
  if (!r) return null;
  let n = await OOt(t, r, e);
  return { indexPath: r, sharedIndexPath: n };
}
async function OOt(t, e, r) {
  let n = await NOt(e, t);
  if (n == null) return (await vNe(t, r)) ?? null;
  let o = yNe.get(t);
  if (o?.indexPath === e && o.indexFingerprint === n) return o.sharedIndexPath;
  let i = await vNe(t, r);
  return (
    i !== void 0 && yNe.set(t, { indexFingerprint: n, indexPath: e, sharedIndexPath: i }),
    i ?? null
  );
}
async function NOt(t, e) {
  try {
    let r = await e.host.stat(t, { bypassCache: !0 });
    return [r.size ?? 0, r.mtimeMs ?? 0, r.ctimeMs ?? 0, r.ino ?? 0].join(":");
  } catch (r) {
    return typeof r == "object" && r != null && "code" in r && r.code === "ENOENT"
      ? "missing"
      : null;
  }
}
async function vNe(t, e) {
  let { success: r, stdout: n } = await I(t.root, ["rev-parse", "--shared-index-path"], t.host, {
    signal: e,
  });
  if (!r) return;
  if (!n) return null;
  let o = await t.host.platformPath();
  return o.isAbsolute(n) ? n : o.resolve(t.root, n);
}
var yNe,
  Zy = g(() => {
    tA();
    fe();
    yNe = new WeakMap();
  });
function qi(t) {
  return t?.outputLimitExceeded
    ? { type: "diff-too-large", limitBytes: t.outputLimitExceeded.limitBytes }
    : { type: "unknown" };
}
var jm = g(() => {});
var zm,
  bNe,
  SNe,
  Sc = g(() => {
    ((zm = "origin"),
      (bNe = [
        "-c",
        "diff.mnemonicPrefix=false",
        "-c",
        "diff.noprefix=false",
        "-c",
        "core.quotePath=false",
      ]),
      (SNe = [
        "diff",
        "--no-ext-diff",
        "--no-textconv",
        "--color=never",
        "--src-prefix=a/",
        "--dst-prefix=b/",
      ]));
  });
async function ds(t, e, r, n = {}) {
  let { binary: o = !1, maxOutputBytes: i, configOverrides: s = [], ...a } = n,
    l = i == null ? 33554432 : Math.min(i, 33554432);
  return I(t, [...SNe, ...(o ? ["--binary"] : []), ...e], r, {
    ...a,
    configOverrides: [...s, ...bNe],
    maxOutputBytes: l,
  });
}
var Vm = g(() => {
  Sc();
  fe();
});
function _Ne(t) {
  return {
    command: t.command,
    success: t.success,
    code: t.code,
    stdout: t.stdout,
    stderr: t.stderr,
    outputLimitExceeded: t.outputLimitExceeded,
  };
}
async function yO(t, e = [], r, { binary: n = !1 } = {}) {
  let o = await ol(t, r);
  if (!o) return { type: "error", error: { type: "unknown" } };
  let i = null;
  try {
    i = await tl(t.host, "codex-git-index-", r);
    let a = { GIT_INDEX_FILE: await Wy(i, o, t.host) },
      l = await I(t.root, ["add", "-u"], t.host, { configOverrides: e, env: a, signal: r });
    if (!l.success)
      return (
        j3().warning("Failed to stage uncommitted diff", { safe: {}, sensitive: { ..._Ne(l) } }),
        { type: "error", error: { type: "unknown" } }
      );
    let c = await ds(t.root, ["--cached"], t.host, {
      binary: n,
      trim: !1,
      allowedNonZeroExitCodes: [0, 1],
      env: a,
      signal: r,
    });
    return c.outputLimitExceeded || !c.success
      ? (j3().warning("Failed to collect uncommitted diff", { safe: {}, sensitive: { ..._Ne(c) } }),
        { type: "error", error: qi(c) })
      : { type: "success", unifiedDiff: c.stdout, unifiedDiffBytes: c.stdoutBytes };
  } catch (s) {
    return (
      j3().error("failed to collect tracked uncommitted diff", {
        safe: {},
        sensitive: { error: s },
      }),
      { type: "error", error: { type: "unknown" } }
    );
  } finally {
    i && (await t.host.remove(i, { recursive: !0, force: !0 }));
  }
}
var j3,
  z3 = g(() => {
    hr();
    Gy();
    tO();
    Zy();
    jm();
    fe();
    Vm();
    j3 = Ie("git");
  });
async function Cr(t) {
  let e = await wc(t);
  return e.type === "branch" ? e.branch : null;
}
async function wc(t, e) {
  let r = await K3(t, e);
  if (r.success) {
    let n =
      e?.preserveWhitespace && r.stdoutBuffer != null
        ? rA(r.stdoutBuffer)?.replace(/\r?\n$/, "")
        : r.stdout;
    if (n == null) return { type: "unknown", reason: "invalid_value" };
    if (n) return { type: "branch", branch: n };
  }
  if (r.code === 1) return { type: "detached" };
  if (e?.throwOnGitUnavailable && !e.signal?.aborted && !r.success) {
    if (await FOt(t, r)) throw new el();
    return wc(t, { ...e, throwOnGitUnavailable: !1 });
  }
  return { type: "unknown" };
}
async function FOt(t, e) {
  return e.commandNotStarted && e.stderr === No ? !0 : (jM(t.host), !(await Fm(t.host)));
}
function rA(t) {
  try {
    return BOt.decode(t);
  } catch {
    return null;
  }
}
async function xNe(t, e) {
  let r = await K3(t, { signal: e, staleTime: LOt });
  if (!r.success) throw (V3(t), new Error(r.stderr || "Failed to read symbolic Git branch"));
  return r.stdout || null;
}
async function K3(t, e) {
  let r = await Er(
    t.queryClient,
    {
      queryKey: ne(t.root, t.host, "symbolic-head-branch-name"),
      meta: mNe,
      queryFn: async (n) => ({
        generation: t.gitHeadReadGeneration,
        result: await I(t.root, ["symbolic-ref", "--quiet", "--short", "HEAD"], t.host, {
          allowedNonZeroExitCodes: [1],
          collectStdoutBuffer: !0,
          signal: n,
        }),
      }),
      staleTime: e?.staleTime ?? Ve,
    },
    e?.signal,
  );
  return t.gitHeadReadGeneration !== r.generation
    ? (V3(t), K3(t, e))
    : (!r.result.success && r.result.code !== 1 && V3(t), r.result);
}
function V3(t) {
  t.queryClient.invalidateQueries({
    queryKey: ne(t.root, t.host, "symbolic-head-branch-name"),
    exact: !0,
    refetchType: "none",
  });
}
var LOt,
  BOt,
  Gi = g(() => {
    $m();
    je();
    fe();
    ((LOt = 15e3), (BOt = new TextDecoder("utf-8", { fatal: !0, ignoreBOM: !0 })));
  });
async function ANe(t, e = zm) {
  let r = await Z3(t, e);
  return r || $Ot(t, e);
}
function Z3(t, e = zm) {
  return t.queryClient.fetchQuery({
    queryKey: ne(t.root, t.host, "locally-known-default-branch", e),
    meta: eA,
    queryFn: async () => {
      let r = await I(t.root, ["symbolic-ref", "--quiet", `refs/remotes/${e}/HEAD`], t.host, {
        allowedNonZeroExitCodes: [1],
      });
      if (!r.success || !r.stdout) return null;
      let n = `refs/remotes/${e}/`;
      return r.stdout.startsWith(n) ? r.stdout.slice(n.length) : null;
    },
    staleTime: Ve,
  });
}
function $Ot(t, e) {
  return t.queryClient.fetchQuery({
    queryKey: ne(t.root, t.host, "remote-default-branch", e),
    meta: eA,
    queryFn: async () => {
      let r = await I(t.root, ["remote", "show", e], t.host, { timeoutMs: 1e4 });
      if (!r.success || !r.stdout) return null;
      let o = /HEAD branch:\s*(.+)/.exec(r.stdout)?.[1].trim() ?? null;
      return o === "(unknown)" ? null : o;
    },
    staleTime: Ve,
  });
}
var X3 = g(() => {
  Sc();
  je();
  fe();
});
function hn(t) {
  return t.queryClient.fetchQuery({
    queryKey: ne(t.root, t.host, "ordered-remotes"),
    meta: pi,
    queryFn: async () => {
      let e = await I(t.root, ["remote"], t.host);
      if (!e.success || !e.stdout) return [];
      let r = e.stdout
        .split(
          `
`,
        )
        .map((n) => n.trim())
        .filter((n) => n.length > 0);
      return r.includes(zm) && r.length > 1 ? [zm, ...r.filter((n) => n !== zm)] : r;
    },
    staleTime: Ve,
  });
}
var il = g(() => {
  Sc();
  je();
  fe();
});
async function gn(t) {
  let e = await hn(t);
  return UOt(t, e);
}
async function UOt(t, e) {
  if (e.length === 0) return null;
  for (let r of e) {
    let n = await ANe(t, r);
    if (n) return { remote: r, branch: n };
    let o = await qOt(t, r);
    if (o != null) return { remote: r, branch: o };
  }
  return null;
}
async function qOt(t, e) {
  for (let r of ["main", "master"]) if (await GOt(t, e, r)) return r;
  return null;
}
function GOt(t, e, r) {
  return t.queryClient.fetchQuery({
    queryKey: ne(t.root, t.host, "remote-branch", e, r),
    meta: eA,
    queryFn: async () =>
      (
        await I(t.root, ["show-ref", "--verify", "--quiet", `refs/remotes/${e}/${r}`], t.host, {
          allowedNonZeroExitCodes: [1],
        })
      ).code === 0,
    staleTime: Ve,
  });
}
var _c = g(() => {
  X3();
  il();
  je();
  fe();
});
function Xy(t, e, r, n) {
  return t.queryClient.fetchQuery({
    queryKey: ne(t.root, t.host, "left-right-commit-counts", e, r),
    meta: zy,
    queryFn: async () => {
      let o = await I(t.root, ["rev-list", "--left-right", "--count", `${e}...${r}`], t.host, {
        allowedNonZeroExitCodes: [128, 1],
        signal: n,
      });
      if (!o.success || !o.stdout) return null;
      let i = WOt(o.stdout);
      if (!i) return null;
      let s = "equal";
      return (
        i.leftAhead > 0 && i.rightAhead > 0
          ? (s = "diverged")
          : i.leftAhead > 0
            ? (s = "left-ahead")
            : i.rightAhead > 0 && (s = "right-ahead"),
        { leftAhead: i.leftAhead, rightAhead: i.rightAhead, state: s }
      );
    },
    staleTime: Ve,
  });
}
function WOt(t) {
  let e = t.trim();
  if (!e) return null;
  let r = e.split(/\s+/);
  if (r.length < 2) return null;
  let n = Number.parseInt(r[0] ?? "", 10),
    o = Number.parseInt(r[1] ?? "", 10);
  return !Number.isFinite(n) || !Number.isFinite(o) ? null : { leftAhead: n, rightAhead: o };
}
var vO = g(() => {
  je();
  fe();
});
function Uo(t) {
  return /^[0-9a-f]{7,40}$/i.test(t);
}
var td = g(() => {});
async function At(t, e, r, { fresh: n = !1, staleTime: o = Ve } = {}) {
  let i = ne(t.root, t.host, "ref-sha", e);
  n && (await t.queryClient.invalidateQueries({ queryKey: i, exact: !0, refetchType: "none" }));
  let s = await hO(
    t.queryClient,
    {
      queryKey: i,
      meta: zy,
      queryFn: async (a) => {
        let l = t.watchScopedGitReadGeneration,
          c = await I(t.root, ["rev-parse", "--verify", "--quiet", e], t.host, {
            allowedNonZeroExitCodes: [1],
            signal: a,
          });
        if (!c.success) throw new Error("Git ref lookup failed");
        let u = c.stdout.trim();
        if (u && !Uo(u) && !/^[0-9a-f]{64}$/i.test(u))
          throw new Error("Git ref lookup returned an invalid object ID");
        return { sha: u ? u : null, generation: l };
      },
      staleTime: o,
    },
    r,
  );
  return s.generation !== t.watchScopedGitReadGeneration
    ? At(t, e, r, { fresh: !0, staleTime: o })
    : s.sha;
}
var ps = g(() => {
  O();
  je();
  td();
  fe();
});
function nA(t, e, r) {
  return t.queryClient.fetchQuery({
    queryKey: ne(t.root, t.host, "upstream-ref", e),
    meta: pi,
    queryFn: async () => {
      let n = await I(
        t.root,
        ["rev-parse", "--abbrev-ref", "--symbolic-full-name", `${e}@{u}`],
        t.host,
        { allowedNonZeroExitCodes: [128, 1], signal: r },
      );
      return n.success && n.stdout ? n.stdout : null;
    },
    staleTime: Ve,
  });
}
var Y3 = g(() => {
  je();
  fe();
});
function Vs(t) {
  return t.startsWith("refs/") ? t : `refs/heads/${t}`;
}
var Yy = g(() => {});
async function ENe(t, e, r, n, o, i) {
  let s = async () => {
      if (e.type === "working-tree") return "HEAD";
      let u = await r.getWorktreeRepository(t, n);
      if (e.type === "branch") {
        if (u == null || e.branchName === "HEAD" || e.branchName === "@") return e.branchName;
        let p = e.remoteRef;
        if (p == null) return (await Jy(u, e.branchName, i))?.ref ?? e.branchName;
        let m = (await hn(u))
          .filter((h) => p.startsWith(`refs/remotes/${h}/`))
          .sort((h, v) => v.length - h.length)[0];
        if (m == null) return p;
        let f = p.slice(`refs/remotes/${m}/`.length);
        return CNe(u, m, f, i);
      }
      return u == null ? "HEAD" : ((await Cr(u)) ?? (await Z3(u)) ?? "HEAD");
    },
    a = async () => {
      if (e.type !== "working-tree") return null;
      let u = await r.getWorktreeRepository(t, n);
      if (u == null) throw new Error("Failed to collect working tree diff");
      let p = await yO(u, o, i, { binary: !0 });
      if (p.type === "error")
        throw new Error(
          p.error.type === "diff-too-large"
            ? `Working tree diff exceeds the ${p.error.limitBytes}-byte limit`
            : "Failed to collect working tree diff",
        );
      return p.unifiedDiff;
    },
    [l, c] = await Promise.all([s(), a()]);
  return { startingRef: l, startingDiff: c };
}
async function CNe(t, e, r, n) {
  let o = `refs/remotes/${e}/${r}`,
    i = await I(t.root, ["fetch", e, `+refs/heads/${r}:${o}`], t.host, { signal: n });
  if (!i.success) throw new Error(`Failed to fetch latest ${e}/${r}: ${i.stderr || i.stdout}`);
  let s = await At(t, o, n, { fresh: !0 });
  if (s == null) throw new Error(`Failed to resolve latest ${e}/${r}`);
  return s;
}
async function Jy(t, e, r) {
  if (typeof e != "string") {
    let c = await gn(t);
    return c != null
      ? { ref: await CNe(t, c.remote, c.branch, r) }
      : (await hn(t)).length > 0
        ? null
        : Jy(t, e.fetchRemoteDefault, r);
  }
  if (e === "HEAD" || e === "@")
    return (await At(t, `${e}^{commit}`, r)) == null ? null : { ref: e };
  let n = zOt(e),
    o = await nA(t, e, r);
  if (o != null) {
    let c = `refs/remotes/${o}`,
      u = (await At(t, `${c}^{commit}`, r)) != null ? c : Vs(o);
    return (await Xy(t, n ?? e, u, r))?.state === "right-ahead" ? { ref: u } : { ref: n ?? e };
  }
  if (n != null && (await At(t, `${n}^{commit}`, r)) != null) return { ref: n };
  let i = await hn(t);
  if (e.startsWith("refs/remotes/") && (await At(t, `${e}^{commit}`, r)) != null)
    return { ref: e, remoteRef: e };
  let s = VOt(e, i);
  for (let c of s)
    if ((await At(t, `${c.ref}^{commit}`, r)) != null) return { ref: c.ref, remoteRef: c.ref };
  let a = await At(t, `${e}^{commit}`, r);
  if (a === e.toLowerCase()) return { ref: a };
  let l = null;
  for (let c of s)
    try {
      let u = await jOt(t, c, r);
      if (u != null) return u;
    } catch (u) {
      let p = u instanceof Error ? u : new Error(String(u));
      if (r?.aborted || !(u instanceof bO)) throw p;
      l == null && (l = p);
    }
  if (a != null) return { ref: a };
  if (l != null) throw l;
  return null;
}
async function jOt(t, e, r) {
  let n = await I(
    t.root,
    ["ls-remote", "--exit-code", e.remote, `refs/heads/${e.branchName}`],
    t.host,
    { allowedNonZeroExitCodes: [2], signal: r },
  );
  if (!n.success) throw new bO();
  if (n.code === 2) return null;
  if (
    !(
      await I(t.root, ["fetch", e.remote, `+refs/heads/${e.branchName}:${e.ref}`], t.host, {
        signal: r,
      })
    ).success
  )
    throw new Error("Failed to fetch the worktree starting ref");
  if ((await At(t, `${e.ref}^{commit}`, r, { fresh: !0 })) == null)
    throw new Error("Failed to fetch the worktree starting ref");
  return { ref: e.ref, remoteRef: e.ref };
}
function zOt(t) {
  return t.startsWith("refs/heads/") ? t : t.startsWith("refs/") ? null : Vs(t);
}
function VOt(t, e) {
  let r = "refs/remotes/",
    n = t.startsWith(r) ? t.slice(r.length) : t;
  if (t.startsWith("refs/") && !t.startsWith(r)) return [];
  let o = e.find((i) => n.startsWith(`${i}/`));
  return o != null
    ? [RNe(o, n.slice(o.length + 1))]
    : t.startsWith(r)
      ? []
      : e.map((i) => RNe(i, t));
}
function RNe(t, e) {
  return { remote: t, branchName: e, ref: `refs/remotes/${t}/${e}` };
}
var bO,
  SO = g(() => {
    O();
    z3();
    Gi();
    X3();
    _c();
    vO();
    il();
    ps();
    Y3();
    fe();
    Yy();
    bO = class extends Error {
      constructor() {
        super("Failed to validate the worktree starting ref");
      }
    };
  });
async function TNe(t, e, r, n, o) {
  let a = await I(t, ["config", r === "local" ? "--local" : "--worktree", "--get", e], n, {
    signal: o,
  });
  return a.success && a.stdout ? a.stdout : null;
}
function PNe(t, e, r, n) {
  let o = r === "local" ? "--local" : "--worktree",
    i = ["config", o, "--get", e];
  return Er(
    t.queryClient,
    {
      queryKey: ne(t.root, t.host, "config-value-for-scope", r, e),
      meta: pi,
      queryFn: async (s) => {
        let a = await I(t.root, i, t.host, { signal: n == null ? void 0 : s });
        if (a.success) return a.stdout || null;
        if (
          (a.code === 1 && a.stderr.trim() === "") ||
          (r === "worktree" && a.code === 128 && a.stderr.toLowerCase().includes("worktreeconfig"))
        )
          return null;
        throw new Error(
          `git config ${o} --get ${e} failed: ${a.stderr || a.stdout || `exit code ${a.code ?? "unknown"}`}`,
        );
      },
      staleTime: Ve,
    },
    n,
  );
}
var J3 = g(() => {
  je();
  fe();
});
async function INe(t, e, r = "worktree", n) {
  return TNe(t, _g, r, e, n);
}
var kNe = g(() => {
  O();
  J3();
});
async function LNe(t, e, r, n, o, i) {
  return FNe({
    workspaceRoot: t,
    localEnvironment: e,
    scriptType: "setup",
    host: i,
    injectedEnvironment: o,
    onLog: r,
    signal: n,
  });
}
async function BNe(t, e, r, n, o) {
  return (
    (
      await FNe({
        workspaceRoot: t,
        localEnvironment: e,
        scriptType: "cleanup",
        host: o,
        onLog: r,
        signal: n,
      })
    )?.setupResult ?? null
  );
}
async function FNe({
  workspaceRoot: t,
  localEnvironment: e,
  scriptType: r,
  host: n,
  injectedEnvironment: o,
  onLog: i,
  signal: s,
}) {
  let a = iNt(e, r);
  if (a == null) return null;
  let l = sNt(r),
    c = Date.now();
  if (s?.aborted)
    return {
      setupResult: {
        cwd: t,
        scriptPath: e.configPath,
        status: "failed",
        startedAt: c,
        finishedAt: Date.now(),
        error: `${l} canceled`,
        log: "",
      },
      shellEnvironment: null,
    };
  let u = null;
  try {
    let p = await rNt(n),
      m = oNt(a, p);
    if (!m) return null;
    let f = await n.platformPath(),
      h = f.join(t, e.cwdRelativeToGitRoot);
    ((u = f.join(await n.codexHome(), "tmp", "local-environment", crypto.randomUUID())),
      await n.createDirectory(u, { recursive: !0 }));
    let v = !n.isLocal,
      y = TIe(p, v ? {} : process.env),
      w = f.join(u, `${crypto.randomUUID()}-setup_script.${y.scriptExtension}`),
      _ = f.join(u, `${crypto.randomUUID()}-setup_wrapper.${y.scriptExtension}`),
      S = f.join(u, `${crypto.randomUUID()}-before_env.txt`),
      E = f.join(u, `${crypto.randomUUID()}-captured_env.txt`),
      T = m.replace(
        /\r\n/g,
        `
`,
      );
    (await n.writeFile(w, T), await n.writeFile(_, YOt(y.shellKind, w, E, S)));
    let M = { ...(await PV(n, p, v ? {} : process.env, v ? h : process.cwd())), ...KOt, ...o },
      L = new Array(),
      V = new TextDecoder("utf-8", { ignoreBOM: !0 }),
      de = new TextDecoder("utf-8", { ignoreBOM: !0 }),
      ue = "",
      Ae = "",
      ge = (De, Ge, We) => {
        let yt = new Uint8Array(De);
        i?.(We, yt);
        let Sr = (
            (We === "stdout" ? ue : Ae) + (We === "stdout" ? V : de).decode(yt, { stream: !0 })
          ).split(/\r?\n/),
          oe = Sr.pop() ?? "";
        We === "stdout" ? (ue = oe) : (Ae = oe);
        for (let _t of Sr) _t && (L.push(_t), Ge(`[${We}] ${_t}`));
      },
      Pe = () => {
        let De = (Ge, We) => {
          let et = (Ge === "stdout" ? ue : Ae) + (Ge === "stdout" ? V : de).decode();
          Ge === "stdout" ? (ue = "") : (Ae = "");
          for (let tt of et.split(/\r?\n/)) tt && (L.push(tt), We(`[${Ge}] ${tt}`));
        };
        (De("stdout", (Ge) => Qy().info(Ge)), De("stderr", (Ge) => Qy().error(Ge)));
      },
      Q = async () => {
        u != null && (await n.remove(u, { recursive: !0, force: !0 }));
      },
      X = [y.executable, ...y.args, _],
      G = await n.spawn({ args: X, cwd: h, env: M }),
      ce = !1,
      Ce = () => {
        ((ce = !0), G.kill());
      };
    s?.addEventListener("abort", Ce);
    try {
      s?.aborted && Ce();
      let [De] = await Promise.all([
        G.wait(),
        NNe(G.stdout, (Ct) => {
          ge(Ct, (et) => Qy().info(et), "stdout");
        }),
        NNe(G.stderr, (Ct) => {
          ge(Ct, (et) => Qy().error(et), "stderr");
        }),
      ]);
      Pe();
      let Ge = r === "setup" && !ce && De.code === 0 ? await tNt(E, p, n, S) : null;
      await Q();
      let We, yt;
      return (
        ce
          ? ((We = "failed"), (yt = `${l} canceled`))
          : De.code === 0
            ? (We = "succeeded")
            : ((We = "failed"),
              (yt =
                De.signal == null
                  ? `${l} exited with code ${De.code}`
                  : `${l} exited with signal ${De.signal}`)),
        {
          setupResult: {
            scriptPath: w,
            cwd: h,
            status: We,
            startedAt: c,
            finishedAt: Date.now(),
            error: yt,
            log: L.join(`
`),
          },
          shellEnvironment: Ge,
        }
      );
    } finally {
      s?.removeEventListener("abort", Ce);
    }
  } catch (p) {
    return (
      u != null && (await n.remove(u, { recursive: !0, force: !0 })),
      Qy().warning("[local-environment] script failed", {
        safe: { scriptType: r },
        sensitive: { error: p },
      }),
      {
        setupResult: {
          cwd: t,
          scriptPath: e.configPath,
          status: "failed",
          startedAt: c,
          finishedAt: Date.now(),
          error: String(p),
          log: "",
        },
        shellEnvironment: null,
      }
    );
  }
}
function DNe(t) {
  let e = {};
  for (let r of t.replace(/^\uFEFF/, "").split(/\r?\n/)) {
    if (r.length === 0) continue;
    let n = r.indexOf("=");
    n <= 0 || (e[r.slice(0, n)] = r.slice(n + 1));
  }
  return e;
}
function XOt(t, e, r) {
  let n = MNe(t, r),
    o = MNe(e, r),
    i = new Set([...n.keys(), ...o.keys()]),
    s = {},
    a = new Array();
  for (let l of i) {
    let c = n.get(l),
      u = o.get(l),
      p = u?.key ?? c?.key;
    if (p != null && !nNt(p, r) && !ONe(c?.value) && !ONe(u?.value)) {
      if (u == null) {
        a.push(p);
        continue;
      }
      c?.value !== u.value && (s[p] = u.value);
    }
  }
  return a.length === 0 && Object.keys(s).length === 0
    ? null
    : (a.sort(),
      {
        version: 1,
        set: Object.fromEntries(Object.entries(s).sort(([l], [c]) => l.localeCompare(c))),
        exclude: a,
      });
}
function YOt(t, e, r, n) {
  switch (t) {
    case "cmd":
      return QOt(e, r, n);
    case "powershell":
      return eNt(e, r, n);
    case "posix":
      return JOt(e, r, n);
  }
}
function JOt(t, e, r) {
  let n = eK(t);
  return [
    "set -xeo pipefail",
    `capture_path=${eK(e)}`,
    `before_capture_path=${eK(r)}`,
    'env > "$before_capture_path"',
    `trap 'code=$?; if [ "$code" -eq 0 ]; then env > "$capture_path"; fi' EXIT`,
    `. ${n}`,
  ].join(`
`);
}
function QOt(t, e, r) {
  let n = Q3(t),
    o = Q3(e);
  return [
    "@echo off",
    `set > ${Q3(r)}`,
    `call ${n}`,
    "set CODEX_SETUP_EXIT_CODE=%ERRORLEVEL%",
    `if "%CODEX_SETUP_EXIT_CODE%"=="0" set > ${o}`,
    "exit /b %CODEX_SETUP_EXIT_CODE%",
  ].join(`\r
`);
}
function eNt(t, e, r) {
  let n = tK(t),
    o = tK(e);
  return [
    "$ErrorActionPreference = 'Stop'",
    "$PSNativeCommandUseErrorActionPreference = $true",
    "$exitCode = 0",
    `Get-ChildItem Env: | Sort-Object Name | ForEach-Object { '{0}={1}' -f $_.Name, $_.Value } | Set-Content -LiteralPath ${tK(r)} -Encoding utf8`,
    "try {",
    `  & ${n}`,
    "} finally {",
    "  $exitCode = if ($null -eq $LASTEXITCODE) {",
    "    if ($?) { 0 } else { 1 }",
    "  } else {",
    "    [int]$LASTEXITCODE",
    "  }",
    "  if ($exitCode -eq 0) {",
    `    Get-ChildItem Env: | Sort-Object Name | ForEach-Object { '{0}={1}' -f $_.Name, $_.Value } | Set-Content -LiteralPath ${o} -Encoding utf8`,
    "  }",
    "}",
    "exit $exitCode",
  ].join(`
`);
}
function Q3(t) {
  return `"${t.replace(/"/g, '""')}"`;
}
function eK(t) {
  return `'${t.replace(/'/g, "'\\''")}'`;
}
function tK(t) {
  return `'${t.replace(/'/g, "''")}'`;
}
async function tNt(t, e, r, n) {
  try {
    let o = await new Response(await r.readFile(t)).text(),
      i = DNe(await new Response(await r.readFile(n)).text());
    return XOt(i, DNe(o), e);
  } catch (o) {
    return (
      Qy().warning("[local-environment] failed to capture shell env", {
        safe: {},
        sensitive: { error: o },
      }),
      null
    );
  }
}
async function rNt(t) {
  let [e, r] = await Promise.all([t.platformFamily(), t.platformOs()]);
  if (e === "windows") return "win32";
  let n = r.toLowerCase();
  return n.includes("darwin") || n.includes("macos") ? "darwin" : "linux";
}
function MNe(t, e) {
  let r = new Map();
  for (let [n, o] of Object.entries(t)) o != null && r.set($Ne(n, e), { key: n, value: o });
  return r;
}
function $Ne(t, e) {
  return e === "win32" ? t.toUpperCase() : t;
}
function ONe(t) {
  return t == null
    ? !1
    : t.includes(`
`) || t.includes("\r");
}
function nNt(t, e) {
  let r = $Ne(t, e);
  return ZOt.has(r) || r.startsWith("BASH_FUNC_");
}
async function NNe(t, e) {
  let r = t.getReader();
  try {
    for (;;) {
      let { done: n, value: o } = await r.read();
      if (n) return;
      e(o);
    }
  } finally {
    r.releaseLock();
  }
}
function oNt(t, e) {
  if (e === "darwin") {
    let r = t.darwin?.script;
    if (r && r.length > 0) return r;
  }
  if (e === "linux") {
    let r = t.linux?.script;
    if (r && r.length > 0) return r;
  }
  if (e === "win32") {
    let r = t.win32?.script;
    if (r && r.length > 0) return r;
  }
  return t.script;
}
function iNt(t, e) {
  return e === "cleanup" ? (t.environment.cleanup ?? null) : t.environment.setup;
}
function sNt(t) {
  return t === "cleanup" ? "Cleanup script" : "Setup script";
}
var Qy,
  KOt,
  ZOt,
  rK = g(() => {
    O();
    hr();
    IV();
    ((Qy = Ie("git")),
      (KOt = { COLORTERM: "truecolor", FORCE_COLOR: "1", TERM: "xterm-256color" }),
      (ZOt = new Set([
        VI,
        KI,
        "CODEX_SETUP_EXIT_CODE",
        "OLDPWD",
        "PWD",
        "SHELLOPTS",
        "SHLVL",
        "_",
        Ig.toUpperCase(),
      ])));
  });
async function wO(t, e) {
  let r = await crypto.subtle.digest(t, aNt.encode(e));
  return [...new Uint8Array(r)].map((n) => n.toString(16).padStart(2, "0")).join("");
}
var aNt,
  nK = g(() => {
    aNt = new TextEncoder();
  });
function eo(t) {
  return wO("SHA-1", t);
}
var rd = g(() => {
  nK();
});
function cNt(t) {
  let e = fn(t),
    r = UNe.get(e);
  if (r) return r;
  let n = new qNe.Sema(lNt);
  return (UNe.set(e, n), n);
}
async function ms(t, e, r = !1, n, o = !1, i) {
  let s = await eo(t),
    a = cNt(e);
  await a.acquire();
  try {
    (nd().info("[worktree-delete] start", {
      safe: { worktreeId: s, force: r, hasHostConfig: e != null },
      sensitive: {},
    }),
      o || (await dNt(t, s, e, n)));
    let l = await e.platformPath(),
      c = e.isLocal && l.sep === "\\",
      u =
        c && !r && i != null && l.relative(i.repoRoot, t) === ""
          ? await e.stat(t, { bypassCache: !0, followSymlinks: !1 }).catch(() => null)
          : null,
      p = ["worktree", "remove"];
    (r && p.push("--force"), p.push(t));
    let m = await I(l.dirname(t), p, e, {
      configOverrides: c ? ["-c", "core.longpaths=true"] : [],
      env: { GIT_DIR: l.join(t, ".git") },
      signal: n,
    });
    if (
      (nd().info("[worktree-delete] git-remove-result", {
        safe: {
          worktreeId: s,
          force: r,
          success: m.success,
          code: m.code,
          outputLimitExceeded: m.outputLimitExceeded != null,
        },
        sensitive: {},
      }),
      !m.success && !r && !(await uNt(i, u, m, e, n)))
    )
      throw new Error(m.stderr || m.stdout || "Failed to remove worktree.");
    await pNt(t, s, e);
  } finally {
    a.release();
  }
}
async function uNt(t, e, r, n, o) {
  if (
    t == null ||
    e == null ||
    !e.isDirectory() ||
    e.isSymbolicLink() ||
    e.ino == null ||
    e.ino <= 0 ||
    e.birthtimeMs <= 0 ||
    r.code !== 255 ||
    r.outputLimitExceeded != null ||
    o?.aborted
  )
    return !1;
  let i = /^error: failed to delete '(.+)': Filename too long$/i.exec(r.stderr)?.[1],
    s = await n.platformPath();
  if (i == null || s.relative(i, t.repoRoot) !== "") return !1;
  let a = await I(s.dirname(t.repoRoot), ["worktree", "list", "--porcelain", "-z"], n, {
    env: { GIT_DIR: t.commonDir },
    maxOutputBytes: 1024 * 1024,
    timeoutMs: 5e3,
    trim: !1,
    signal: o,
  });
  if (!a.success || a.outputLimitExceeded != null || !a.stdout.endsWith("\0\0")) return !1;
  let l = a.stdout.split("\0\0").filter((p) => p.length > 0);
  if (
    !(
      l.length > 0 &&
      l.every((p) => {
        let m = p.split("\0", 1)[0],
          f = m?.startsWith("worktree ") ? m.slice(9) : null;
        return f != null && s.isAbsolute(f) && s.relative(f, t.repoRoot) !== "";
      })
    )
  )
    return !1;
  let u = await n.stat(t.repoRoot, { bypassCache: !0, followSymlinks: !1 }).catch(() => null);
  return (
    u != null &&
    u.isDirectory() &&
    !u.isSymbolicLink() &&
    u.ino === e.ino &&
    u.birthtimeMs === e.birthtimeMs &&
    !o?.aborted
  );
}
async function dNt(t, e, r, n) {
  let o = await INe(t, r, "worktree", n);
  if (o == null || o === zI) return;
  let i = await jx(o, r);
  if (i.type === "error") {
    nd().warning("[worktree-delete] cleanup-config-unavailable", {
      safe: { worktreeId: e },
      sensitive: { configPath: o, error: i.error },
    });
    return;
  }
  if (!i.environment.cleanup) return;
  nd().info("[worktree-delete] cleanup-script-start", {
    safe: { worktreeId: e },
    sensitive: { configPath: o },
  });
  let s = await BNe(t, i, void 0, n, r);
  if (s != null) {
    if (s?.status === "failed")
      throw (
        nd().warning("[worktree-delete] cleanup-script-failed", {
          safe: { worktreeId: e },
          sensitive: { configPath: o, error: s.error },
        }),
        new Error(s.error ?? "Cleanup script failed")
      );
    nd().info("[worktree-delete] cleanup-script-finished", {
      safe: { worktreeId: e },
      sensitive: { configPath: o },
    });
  }
}
async function pNt(t, e, r) {
  let n = await r.platformPath(),
    o = !1,
    i = !1;
  try {
    (await r.remove(t, { recursive: !0, force: !0 }), (o = !0));
  } catch (s) {
    if (!bt(s)) throw s;
  }
  try {
    let s = n.dirname(t);
    if (s === t) return;
    (await r.readDirectory(s)).length === 0 &&
      (await r.remove(s, { recursive: !0, force: !0 }), (i = !0));
  } catch (s) {
    nd().warning("Failed to remove worktree parent directory", {
      safe: {},
      sensitive: { error: s },
    });
  }
  nd().debug("[worktree-delete] cleanup-finished", {
    safe: { worktreeId: e },
    sensitive: { removedWorktreeDir: o, removedParentDir: i },
  });
}
var qNe,
  nd,
  lNt,
  UNe,
  ev = g(() => {
    qNe = F(Gx());
    O();
    hr();
    QM();
    kNe();
    Qx();
    fe();
    rK();
    rd();
    ((nd = Ie("git")), (lNt = 3), (UNe = new Map()));
  });
async function to(t, e, r) {
  let n = ne(t.root, t.host, "safe-attribute-filter-overrides");
  r != null && n.push(r.GIT_DIR, r.GIT_COMMON_DIR);
  let o = t.gitConfigReadGeneration,
    i = await Er(
      t.queryClient,
      {
        queryKey: n,
        meta: pi,
        staleTime: Ve,
        queryFn: async (s) => {
          let a = await I(t.root, ["config", "--name-only", "--get-regexp", mNt], t.host, {
            allowedNonZeroExitCodes: [1],
            env: r,
            signal: e == null ? void 0 : s,
          });
          if (!a.success)
            throw new Error(`git config filter discovery failed: ${a.stderr || a.stdout}`);
          let l = new Set();
          for (let c of a.stdout.split(/\r?\n/)) {
            let u = hNt(c.trim());
            u != null && l.add(u);
          }
          return [
            ...fNt,
            ...[...l].flatMap((c) => [
              "-c",
              `filter.${c}.clean=`,
              "-c",
              `filter.${c}.smudge=`,
              "-c",
              `filter.${c}.process=`,
              "-c",
              `filter.${c}.required=false`,
            ]),
          ];
        },
      },
      e,
    );
  return t.gitConfigReadGeneration !== o
    ? (t.queryClient.invalidateQueries({ queryKey: n, exact: !0, refetchType: "none" }),
      to(t, e, r))
    : i;
}
function hNt(t) {
  return /^filter\.(.+)\.(?:clean|smudge|process|required)$/.exec(t)?.[1] ?? null;
}
var mNt,
  fNt,
  xc = g(() => {
    je();
    fe();
    ((mNt = "^filter\\..*\\.(clean|smudge|process|required)$"),
      (fNt = ["-c", "attr.tree=", "-c", "core.attributesFile="]));
  });
var WNe = A((jjr, GNe) => {
  function gNt(t) {
    for (var e = -1, r = t == null ? 0 : t.length, n = 0, o = []; ++e < r; ) {
      var i = t[e];
      i && (o[n++] = i);
    }
    return o;
  }
  GNe.exports = gNt;
});
async function _O(t, e, { configOverrides: r = [], onStatus: n, signal: o } = {}) {
  let i = await I(
      t,
      [
        "status",
        n == null ? "--no-renames" : "--renames",
        "--porcelain=v1",
        "-z",
        "--untracked-files=normal",
      ],
      e,
      { collectStdoutBuffer: !0, configOverrides: r, signal: o, trim: !1 },
    ),
    s = Ns(i.stdoutBuffer);
  if (!i.success || s == null)
    return {
      success: !1,
      paths: [],
      gitRoot: t,
      failureReason: i.success ? "unsupported_filename_encoding" : void 0,
    };
  n?.(s);
  let a = [],
    l = s.split("\0");
  for (let c = 0; c < l.length; c += 1) {
    let u = l[c];
    u != null &&
      (u.startsWith("?? ") ? a.push(u.slice(3)) : /[RC]/.test(u.slice(0, 2)) && (c += 1));
  }
  return VNe(t, e, a, o);
}
async function zNe(t, e, r) {
  let n = await I(
      t,
      [
        "ls-files",
        "--others",
        "--exclude-standard",
        "--directory",
        "--no-empty-directory",
        "-z",
        "--",
      ],
      e,
      { collectStdoutBuffer: !0, signal: r, trim: !1 },
    ),
    o = Ns(n.stdoutBuffer);
  return !n.success || o == null
    ? {
        success: !1,
        paths: [],
        gitRoot: t,
        failureReason: n.success ? "unsupported_filename_encoding" : void 0,
      }
    : VNe(
        t,
        e,
        o.split("\0").filter((i) => i.length > 0),
        r,
      );
}
async function VNe(t, e, r, n) {
  let o = r.filter((s) => s.endsWith("/")),
    i = await oK(t, e, o, n);
  return i.success
    ? { success: !0, gitRoot: t, paths: [...r.filter((s) => !s.endsWith("/")), ...i.paths] }
    : i;
}
async function oK(t, e, r, n) {
  if (r.length === 0) return { success: !0, paths: [], gitRoot: t };
  let o = await I(t, ["ls-files", "--others", "--exclude-standard", "-z", "--", ...r], e, {
      collectStdoutBuffer: !0,
      signal: n,
      trim: !1,
    }),
    i = Ns(o.stdoutBuffer);
  if (!o.success || i == null)
    return {
      success: !1,
      paths: [],
      gitRoot: t,
      failureReason: o.success ? "unsupported_filename_encoding" : void 0,
    };
  let s = i.split("\0").filter((u) => u.length > 0),
    a = s.filter((u) => u.endsWith("/"));
  if (a.length === 0) return { success: !0, paths: s, gitRoot: t };
  let l = await e.platformPath(),
    c = new Set();
  for (let u of (0, HNe.default)(a, 8)) {
    if (n?.aborted) return { success: !1, paths: [], gitRoot: t };
    let p = await Promise.all(
      u.map(async (m) =>
        (
          await I(l.join(t, m), ["rev-parse", "--verify", "--quiet", "HEAD^{commit}"], e, {
            allowedNonZeroExitCodes: [1],
            signal: n,
          })
        ).code === 1
          ? m
          : null,
      ),
    );
    for (let m of (0, jNe.default)(p)) c.add(m);
  }
  return n?.aborted
    ? { success: !1, paths: [], gitRoot: t }
    : {
        success: !0,
        gitRoot: t,
        paths: s.flatMap((u) => (c.has(u) ? [] : u.endsWith("/") ? [u.slice(0, -1)] : [u])),
      };
}
function KNe(t, e) {
  return t.queryClient.fetchQuery({
    queryKey: ne(t.root, t.host, "tracked-paths", e),
    gcTime: be,
    meta: Ue,
    queryFn: () => iK(t, e),
    staleTime: be,
  });
}
async function iK(t, e, r) {
  let n = await I(t.root, ["ls-files", "--cached", "-z", "--", ...e], t.host, {
      collectStdoutBuffer: !0,
      env: r,
      trim: !1,
    }),
    o = Ns(n.stdoutBuffer);
  return !n.success || o == null
    ? { success: !1, paths: [], gitRoot: t.root }
    : { success: !0, paths: o.split("\0").filter((i) => i.length > 0), gitRoot: t.root };
}
function ZNe(t, e) {
  return t.queryClient.fetchQuery({
    queryKey: ne(t.root, t.host, "path-status", e),
    gcTime: be,
    meta: Ue,
    queryFn: () => oA(t, e),
    staleTime: be,
  });
}
