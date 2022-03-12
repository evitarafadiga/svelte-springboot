package br.com.fateczl.ProjetoLibero.model;

import java.util.Arrays;

public class Local {
	
	private int id;
	private String[] atributos;
	private String pais;
	private String idPais;
	private String nome;
	public int getId() {
		return id;
	}
	public void setId(int id) {
		this.id = id;
	}
	public String[] getAtributos() {
		return atributos;
	}
	public void setAtributos(String[] atributos) {
		this.atributos = atributos;
	}
	public String getPais() {
		return pais;
	}
	public void setPais(String pais) {
		this.pais = pais;
	}
	public String getIdPais() {
		return idPais;
	}
	public void setIdPais(String idPais) {
		this.idPais = idPais;
	}
	public String getNome() {
		return nome;
	}
	public void setNome(String nome) {
		this.nome = nome;
	}
	@Override
	public String toString() {
		return "Local [id=" + id + ", atributos=" + Arrays.toString(atributos) + ", pais=" + pais
				+ ", idPais=" + idPais + ", nome=" + nome + "]";
	}

	
}
