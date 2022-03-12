package br.com.fateczl.ProjetoLibero.model;

import java.util.Arrays;

public class PalavraChave {
	private int indice;
	private String texto;

	public int getIndice() {
		return indice;
	}
	public void setIndice(int indice) {
		this.indice = indice;
	}
	public String getTexto() {
		return texto;
	}
	public void setTexto(String texto) {
		this.texto = texto;
	}
	@Override
	public String toString() {
		return "PalavraChave [indice=" + indice + ", texto=" + texto + "]";
	}
	
}
