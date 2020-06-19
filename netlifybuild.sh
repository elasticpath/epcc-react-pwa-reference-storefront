#!/bin/bash

set -x
set -e

export CI=true

yarn build

cp ./_redirects build/

ls -lsa build/
