require "sinatra/base"

class RailsConsoleApp < Sinatra::Base

  get "/" do
    Rails.logger.info params
    content_type 'text/event-stream'
    stream :keep_open do |out|
      #Rails.logger.info out.closed?
      10.times do
        sleep(3)
        out << "Hello Sinatra World\n"
      end
    end
  end
end