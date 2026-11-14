#!/bin/sh
# Keep new compiler, dependency, temporary and build files off the system disk.
set -eu
repo_root=$(CDPATH= cd -- "$(dirname -- "$0")/../.." && pwd)
build_root=${CODEXX_BUILD_ROOT:-/Volumes/kenny/codex-build}
if [ ! -d "$(dirname -- "$build_root")" ]; then
  echo "Build volume is unavailable: $build_root" >&2
  exit 1
fi
export RUSTUP_HOME="$build_root/rustup"
export CARGO_HOME="$build_root/cargo"
export CARGO_TARGET_DIR="$build_root/target"
export TMPDIR="$build_root/tmp"
export CARGO_INCREMENTAL=0
export CARGO_BUILD_JOBS=${CARGO_BUILD_JOBS:-4}
mkdir -p "$RUSTUP_HOME" "$CARGO_HOME" "$CARGO_TARGET_DIR" "$TMPDIR"
cd "$repo_root/codex-rs"
# Fault tests deliberately refuse loopback connections. Keep these off proxies.
case ${1:-build} in
  test|validate)
    NO_PROXY="${NO_PROXY:+$NO_PROXY,}127.0.0.1,localhost"
    export NO_PROXY
    no_proxy="$NO_PROXY"
    export no_proxy
    ;;
esac
case ${1:-build} in
  setup)
    rustup toolchain install 1.99.1 --profile minimal --component rustfmt --component clippy --component rust-src --no-self-update
    ;;
  build)
    cargo build --locked --profile dev-small -p codex-cli --bin codex
    ;;
  test)
    cargo test --locked --profile dev-small -p codex-core --lib responses_retry
    ;;
  validate)
    cargo test --locked --profile dev-small -p codex-core --lib responses_retry
    cargo test --locked --profile dev-small -p codex-features
    cargo test --locked --profile dev-small -p codex-api
    cargo run --locked --profile dev-small -p codex-config-schema --bin codex-write-config-schema
    ;;
  *) echo 'Usage: sh vscode-extension/scripts/engine.sh [setup|build|test|validate]' >&2; exit 2 ;;
esac
