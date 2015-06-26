require 'sinatra/base'
require 'webrick'
require 'webrick/https'

require './routes/cors'
require './routes/default'

class WalletApp < Sinatra::Base

  configure do

    # Register routes
    register Sinatra::CorsRoutes
    register Sinatra::DefaultRoutes

  end

end