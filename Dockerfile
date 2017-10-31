FROM scratch
MAINTAINER Paul Castle <paul.castle@gmail.com>
ADD instarss instarss
EXPOSE 80
ENTRYPOINT ["/instarss"]