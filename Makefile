.PHONY: install

install:
	gem install zendesk_apps_tools ;

run:
	zat theme preview --role=end_user ;