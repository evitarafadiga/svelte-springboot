package br.com.fateczl.ProjetoLibero.model;

public class Contribuidor {

	private int id;
	private String idStr;
	private String nome;
	
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
	public String getNome() {
		return nome;
	}
	public void setNome(String nome) {
		this.nome = nome;
	}
	@Override
	public String toString() {
		return "Contribuidor [id=" + id + ", idStr=" + idStr + ", nome=" + nome + "]";
	}
	
}
