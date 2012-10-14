class WelcomeController < ApplicationController
  def index
    
  end

  def console_execute
    result  = ""
    output  = ""
    error   = ""

    require 'pp'

    stub_kenel_exec

    FakeFS do
      output = capture_stdout do
        result = begin 
          eval(params[:value])
        rescue => e
          error = "#{e.class} (#{e.message}):\n" + e.backtrace[0..10].map{|l| "  " + l}.join("\n")
          Rails.logger.info error
          ""
        end
      end
    end

    result = result.inspect #unless result.is_a?(String)
    render :json => {:result => result, :output => output.string, :error => error }
  end

  def stub_kenel_exec
    Kernel.instance_eval do
      for mname in [:'`', :system, :exec, :spawn]
        define_method mname do |*args|
          raise "system command execution is blocked"
        end
      end
    end

    Process.instance_eval do
      for mname in [:exec, :spawn]
        define_method mname do |*args|
          raise "system command execution is blocked"
        end
      end
    end
  end
end
