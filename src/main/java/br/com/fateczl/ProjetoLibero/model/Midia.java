package br.com.fateczl.ProjetoLibero.model;

import java.util.Arrays;

public class Midia {
	
	private int id;
	private String idStr;
	private String midiaUrl;
	private String tipo;
	private int[] indice;
	
	public int getId() {
		return id;
	}
	public void setId(int id) {
		this.id = id;
	}
	public String getIdStr() {
		return idStr;
	}
	public void setIdStr(String idStr) {
		this.idStr = idStr;
	}
	public String getMidiaUrl() {
		return midiaUrl;
	}
	public void setMidiaUrl(String midiaUrl) {
		this.midiaUrl = midiaUrl;
	}
	public String getTipo() {
		return tipo;
	}
	public void setTipo(String tipo) {
		this.tipo = tipo;
	}
	public int[] getIndice() {
		return indice;
	}
	public void setIndice(int[] indice) {
		this.indice = indice;
	}
	@Override
	public String toString() {
		return "Midia [id=" + id + ", idStr=" + idStr + ", midiaUrl=" + midiaUrl + ", tipo=" + tipo + ", indice="
				+ Arrays.toString(indice) + "]";
	}
	

}
