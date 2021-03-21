#!/bin/sh

# Exit if any subcommand fails
set -e

# Install AdonisJs
yarn global add @adonisjs/cli
yarn install --non-interactive --silent --ignore-scripts --production=false

# Setup AdonisJs
cp .env.example .env
adonis key:generate

# Run tasks
#yarn lint
#yarn test

echo '👍 GREAT SUCCESS!'