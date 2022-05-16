#!/bin/bash
# ============================================================================ #
# Author: Tancredi-Paul Grozav <paul@grozav.info>
# ============================================================================ #
# ============================================================================ #


# ============================================================================ #
# Global variables
# ============================================================================ #
should_debug=0 &&
should_debug=1 && # Uncomment to enable debugging
# Start debugging
[ ${should_debug} -eq 1 ] && set -x || true &&

script_dir="$( cd $( dirname ${0} ) && pwd )" &&
build_container_name="typescript_compiler" &&
cmgr="docker" &&
# ============================================================================ #





# ============================================================================ #
# Private methods
# ============================================================================ #

# ============================================================================ #
# Is build container created.
# ============================================================================ #
function is_build_container_created()
{
  return $(set -x && ${cmgr} ps -a | grep -w ${build_container_name} | wc -l)
} &&
# ============================================================================ #


# ============================================================================ #
# Is build container running.
# ============================================================================ #
function is_build_container_running()
{
  return $(${cmgr} ps | grep -w ${build_container_name} | wc -l)
} &&
# ============================================================================ #


# ============================================================================ #
# Create build container.
# ============================================================================ #
function create_build_container()
{
  ${cmgr} \
    run \
    --detach \
    --name ${build_container_name} \
    --volume ${script_dir}:/app:rw \
    --entrypoint /bin/sh \
    -p 0.0.0.0:1026:8080 \
    docker.io/node:18.1.0-alpine3.15 \
    -c "
      cd /app &&
      echo npm install --global typescript &&
      echo npm install --global babylonjs &&
      echo npm install --global browserify &&
      sleep infinity
    "
  # ec="$(${cmgr} \
  #   exec \
  #   ${build_container_name} \
  #   /bin/sh -c "
  #     cd /tmp &&
  #     tsc ;
  #     echo \${?}
  #   ")" &&
  # echo "ec=${ec}"
} &&
# ============================================================================ #

# ============================================================================ #





# ============================================================================ #
# Public methods
# ============================================================================ #

# ============================================================================ #
# Build the app.
# ============================================================================ #
function build()
{
  # Create
  if [ "$(is_build_container_created ; echo ${?})" == "1" ]
  then
    echo "Container exists"
  else
    echo "Container must be created" &&
    create_build_container
  fi &&

  # Run / start
  if [ "$(is_build_container_running ; echo ${?})" == "1" ]
  then
    echo "Container is running"
  else
    echo "Container must be started" &&
    ${cmgr} start ${build_container_name}
  fi &&

  echo "Building the app ..." &&
  ${cmgr} \
    exec \
    --interactive \
    --tty \
    ${build_container_name} \
    /bin/sh -c "
      apk add bash &&
      cd /app &&
      ./manage.sh --build-inside
    " \
  &&

  echo "Done" &&

  true
} &&
# ============================================================================ #

# ============================================================================ #
# Build the app inside node.js container.
# ============================================================================ #
function build-inside()
{
  echo "NPM install & list ..." &&
  npm install &&
  npm list &&

  echo "Compiling TypeScript and bundling ..." &&
  npm run bundle &&
  echo "bundle.ec=${?}" &&

  echo "Remove intermediar build files ..." &&
  # Removed these to delete other files/folders from the build dir
#    -maxdepth 1 \
#    -type f \
  find ${script_dir}/build \
    -mindepth 1 \
    -not -name index.html \
    -and -not -name bundle.js \
    -print0 | xargs -0  -I {} rm -vrf {} \
    &&

  echo "Deploy html file ..." &&
  cp ${script_dir}/src/index.html ${script_dir}/build/index.html &&
#  cp ${script_dir}/tmp_models/model.glb ${script_dir}/build/ &&

  true
} &&
# ============================================================================ #

# ============================================================================ #
# Remove the build environment.
# ============================================================================ #
function rm-env()
{
  ${cmgr} \
    stop \
    -t0 \
    ${build_container_name} \
    &&
  ${cmgr} \
    rm \
    ${build_container_name} \
    &&
  true
} &&
# ============================================================================ #

# ============================================================================ #
# Attach to the build environment.
# ============================================================================ #
function attach-env()
{
  ${cmgr} \
    exec \
    -it \
    ${build_container_name} \
    /bin/sh \
    -c "
      cd /app &&
      sh
    "
} &&
# ============================================================================ #

# ============================================================================ #
# Watch/rebuild and serve web app.
# ============================================================================ #
function start()
{
  ${cmgr} \
    exec \
    -it \
    ${build_container_name} \
    /bin/sh \
    -c "
      cd /app &&
      npm run start
    "
} &&
# ============================================================================ #

# ============================================================================ #





# ============================================================================ #
# Prints a help menu.
# ============================================================================ #
function print_help()
{
  echo "Usage:
  --build               Build the app.
  --build-inside        Build the app.
  --rm-env              Remove build environment.
  --attach-env          Attach to the build environment.
  --start               Watch/rebuild and serve web app.
  anything-else         Print this help menu." &&
  true
} &&
# ============================================================================ #





# ============================================================================ #
# Case logic
# ============================================================================ #
# If no parameter
if [ ${#} == 0 ]; then
  print_help
fi &&

# Case
first_param="${1}" &&
shift &&
exit_code=0 &&
if [ ${first_param} ]; then
  case "${first_param}" in
    --build) ${first_param#--} ${@} ; exit_code=${?} ;;
    --build-inside) ${first_param#--} ${@} ; exit_code=${?} ;;
    --rm-env) ${first_param#--} ${@} ; exit_code=${?} ;;
    --attach-env) ${first_param#--} ${@} ; exit_code=${?} ;;
    --start) ${first_param#--} ${@} ; exit_code=${?} ;;
    *) print_help ; exit_code=0 ;;
  esac
fi &&

# Stop debugging
[ ${should_debug} -eq 1 ] && set +x || true &&
exit ${exit_code}
# ============================================================================ #
