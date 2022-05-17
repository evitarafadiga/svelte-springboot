package br.com.fateczl.ProjetoLibero.controller;

import org.python.util.PythonInterpreter;

public class Pytrends {

	public static void main(String[] args) {
		PythonInterpreter interp = new PythonInterpreter();
		interp.exec("import sys");
		interp.exec("print sys.version");
		interp.exec("sys.path.append('C:\\jython2.7.2\\Lib')");
		interp.exec("sys.path.append('C:\\jython2.7.2\\Lib\\site-packages')");
		interp.exec("from pytrends.request import TrendReq");
		interp.exec("pytrend = TrendReq(hl='en-US', tz=360)");
		interp.exec("keywords = pytrend.suggestions(keyword='Java')");
		interp.exec("print(keywords)");
	}

}
