require 'sinatra/base'

module Sinatra
  module CorsRoutes

    def self.registered(app)

      app.options '*' do
        response.headers['Access-Control-Allow-Headers'] = 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Cache-Control, Accept, Authorization'
        response.headers['Access-Control-Allow-Origin'] = '*'
        response.headers['Access-Control-Allow-Credentials'] = 'true'
        response.headers['Access-Control-Allow-Methods'] = 'GET, OPTIONS'
      end

      app.before do
        # if request.request_method == 'OPTIONS'
        # Needed for AngularJS
        response.headers['Access-Control-Allow-Headers'] = 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Cache-Control, Accept, Authorization, Content-Length'
        response.headers['Access-Control-Allow-Origin'] = '*'
        response.headers['Access-Control-Allow-Credentials'] = 'true'
        response.headers['Access-Control-Allow-Methods'] = 'GET, OPTIONS'

        # halt 200
        # end
      end
    end
  end
  register CorsRoutes
end
