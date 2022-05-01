package br.com.fateczl.ProjetoLibero.model;

public class Carreiras {

	private int id_car;
	private String nome;
	
	public int getId_car() {
		return id_car;
	}
	public void setId_car(int id_car) {
		this.id_car = id_car;
	}
	public String getNome() {
		return nome;
	}
	public void setNome(String nome) {
		this.nome = nome;
	}
	@Override
	public String toString() {
		return "Carreiras [id_car=" + id_car + ", nome=" + nome + "]";
	}
}
