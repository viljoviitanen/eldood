all:
	@echo "usage: make update|clearrun|run"
clearrun:
	( cd ..; ./devappserver2.py --clear_datastore yes --host 0.0.0.0 --log_level debug eldood )
run:
	( cd ..; ./devappserver2.py --host 0.0.0.0 --log_level debug eldood )
update:
	( cd ..; ./appcfg.py update eldood )
