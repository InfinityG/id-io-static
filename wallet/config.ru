#config.ru
# see http://bundler.io/v1.3/sinatra.html

# require 'rubygems'
# require 'bundler'

# Bundler.require

require './app'
require 'webrick'

options = {
    :Host => '0.0.0.0',
    :Port => 8000
}

# run WalletApp
Rack::Handler::WEBrick.run WalletApp, options do |server|
  [:INT, :TERM].each do |sig|
    trap(sig) do
      server.shutdown
    end
  end
end

# start this with 'rackup' to start in development environment. Switch '-p' for port is not required as this is detected
# from configuration. eg:

# 'rackup -E development' for development environment
# 'rackup -E test' for test environment
# 'rackup -E production' for production environment