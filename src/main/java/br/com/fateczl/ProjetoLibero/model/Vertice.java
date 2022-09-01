package br.com.fateczl.ProjetoLibero.model;

public class Vertice {
	
	private int id;
	private int fromId;
	private int toId;
	private int peso;
	
	public int getId() {
		return id;
	}
	public void setId(int id) {
		this.id = id;
	}
	public int getFromId() {
		return fromId;
	}
	public void setFromId(int fromId) {
		this.fromId = fromId;
	}
	public int getToId() {
		return toId;
	}
	public void setToId(int toId) {
		this.toId = toId;
	}
	public int getPeso() {
		return peso;
	}
	public void setPeso(int peso) {
		this.peso = peso;
	}
	@Override
	public String toString() {
		return "\nVertice [id=" + id + ", fromId=" + fromId + ", toId=" + toId + ", peso=" + peso + "]";
	}
	
}
