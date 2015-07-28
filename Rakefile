require "bundler/setup"
require "ember-dev/tasks"

directory "tmp"

task :clean => "ember:clean"
task :dist => "ember:dist"
task :test, [:suite] => "ember:test"
task :default => :dist

task :copy_to_c2 => :dist do
  front_end_path = File.expand_path "../../frontend/vendor/javascripts/", __FILE__
  dist_path = File.expand_path "../dist", __FILE__

  [File.join(dist_path, "ember-data.js"), File.join(dist_path, "ember-data.min.js")].each do |file|
    # sh %Q{"cp #{file} #{front_end_path}"}
    `cp #{file} #{front_end_path}`
  end
end

task :publish_build do
  root = File.expand_path(File.dirname(__FILE__)) + '/dist/'
  EmberDev::Publish.to_s3({
    :access_key_id => ENV['S3_ACCESS_KEY_ID'],
    :secret_access_key => ENV['S3_SECRET_ACCESS_KEY'],
    :bucket_name => ENV['S3_BUCKET_NAME'],
    :files => [ root + 'ember-data.js' ]
  })
end
