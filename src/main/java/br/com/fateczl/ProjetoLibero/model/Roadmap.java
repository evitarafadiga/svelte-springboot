package br.com.fateczl.ProjetoLibero.model;

public class Roadmap {
	
	private Comentarios comentarios;

	private int id;
	private String criadoEm;
	private int qtdFavoritos;
	private int qtdCompartilhamento;
	private String fonte;
	private String descricao;
	private String nome;
	private String atualizadoEm;
	
	public int getId() {
		return id;
	}
	public void setId(int id) {
		this.id = id;
	}
	public String getCriadoEm() {
		return criadoEm;
	}
	public void setCriadoEm(String criadoEm) {
		this.criadoEm = criadoEm;
	}
	public int getQtdFavoritos() {
		return qtdFavoritos;
	}
	public void setQtdFavoritos(int qtdFavoritos) {
		this.qtdFavoritos = qtdFavoritos;
	}
	public int getQtdCompartilhamento() {
		return qtdCompartilhamento;
	}
	public void setQtdCompartilhamento(int qtdCompartilhamento) {
		this.qtdCompartilhamento = qtdCompartilhamento;
	}
	public String getFonte() {
		return fonte;
	}
	public void setFonte(String fonte) {
		this.fonte = fonte;
	}
	public String getDescricao() {
		return descricao;
	}
	public void setDescricao(String descricao) {
		this.descricao = descricao;
	}
	public String getNome() {
		return nome;
	}
	public void setNome(String nome) {
		this.nome = nome;
	}
	public String getAtualizadoEm() {
		return atualizadoEm;
	}
	public void setAtualizadoEm(String atualizadoEm) {
		this.atualizadoEm = atualizadoEm;
	}
	@Override
	public String toString() {
		return "\nRoadmap [id=" + id + ", criadoEm=" + criadoEm + ", qtdFavoritos=" + qtdFavoritos
				+ ", qtdCompartilhamento=" + qtdCompartilhamento + ", fonte=" + fonte + ", descricao=" + descricao + ", nome=" + nome + ", atualizadoEm="
				+ atualizadoEm + "]";
	}
	public Comentarios getComentarios() {
		return comentarios;
	}
	public void setComentarios(Comentarios comentarios) {
		this.comentarios = comentarios;
	}

}
