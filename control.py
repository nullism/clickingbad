#!/usr/bin/env python2
"""
The MIT License (MIT)

Copyright (c) 2013, Aaron Meier

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
"""

import argparse
from jinja2 import Environment, PackageLoader
import const
import os
import sys
import re

self_path = os.path.abspath(os.path.dirname(__file__))
env = Environment(loader=PackageLoader(__name__, 'templates'))

def minify_template(txt):
    ''' Currently doesn't do much '''
    
    # Remove comments
    txt = re.sub(r'\s/\*.*?\*/', '', txt, flags=re.DOTALL)
    txt = re.sub(r'^\s{0,12}//.*$', '', txt, flags=re.M)
    #txt = re.sub(r'<!\-\-.*?\-\->', '', txt)

    return txt

def cache_version():
    ''' Create or overwrite the version.json file from const.VERSION '''
    vpath = os.path.join(self_path, const.DOCROOT, 'version.json')
    print 'Creating %s'%(vpath)
    open(vpath,'w').write('{"data":{"version":"%s"}}'%(const.VERSION))

def cache_template(tpl, isapp=False, minify=False):
    ''' Cache a template in ./templates '''
    pg_tpl = env.get_template(tpl)
    out = os.path.join(self_path, const.DOCROOT, tpl)
    if isapp:
        out = os.path.join(self_path, const.APP_DOCROOT, tpl)
    print 'Caching template to %s'%(out)
    html = pg_tpl.render(version=const.VERSION, 
        isapp=isapp, updated=const.UPDATED)
    if minify:
        html = minify_template(html)
    open(out,'wb').write(html)


def cache_all():
    ''' Update this list when new templates are added '''
    cache_template('index.html', minify=True)
    cache_template('index.html', minify=True, isapp=True)
    cache_template('config.xml', minify=True, isapp=True)
    cache_template('thanks.html')
    cache_version()

def run_test_server():
    ''' Uses SimpleHTTPServer and SocketServer to serve 
        static content from const.DOC_ROOT '''
    
    abs_docroot = os.path.join(self_path, const.DOCROOT)
    print ('Due to a bug in SocketServer keeping the socket open\n'
        + 'run: `cd %s && python -m SimpleHTTPServer %s` instead'\
        %(abs_docroot, const.TEST_PORT))
    return

    import SimpleHTTPServer
    import SocketServer

    Handler = SimpleHTTPServer.SimpleHTTPRequestHandler
    httpd = SocketServer.TCPServer(("", const.TEST_PORT), Handler)
    os.chdir(abs_docroot)

    try:
        print "Started serving from %s on localhost:%s"\
            %(abs_docroot, const.TEST_PORT)
        httpd.serve_forever()
    except(KeyboardInterrupt):
        httpd.shutdown()
        httpd.socket.close()
        print "Server stopped"
    except(Exception),e:
        httpd.shutdown()
        print "Exception: %s"%(e)


if __name__ == "__main__":
    parser = argparse.ArgumentParser(
        description='Cache control and test server for Clicking Bad development'
    )
    parser.add_argument('command', choices=('cache','test-server','version'))
    args = parser.parse_args()

    if args.command == 'cache':
        cache_all()
         
    if args.command == 'test-server':
        cache_all()
        run_test_server()
    
    if args.command == 'version':
        print 'Current version: %s'%(const.VERSION)
