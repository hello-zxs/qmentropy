source "https://rubygems.org"

# 本地预览与 CI 构建用的依赖。
# GitHub Pages 的线上构建使用它自己的 gem 集合，不读取这个文件；
# 这里保持一致，便于在本地复现 Pages 的结果。
gem "jekyll", "~> 4.3"

gem "jekyll-sitemap", "~> 1.4"
gem "jekyll-feed", "~> 0.17"

# Ruby 3.x 不再内置 webrick，`jekyll serve` 需要它
gem "webrick", "~> 1.8"
