package br.com.fateczl.ProjetoLibero.model;

public class Comentarios {
	
	private int id;
	private String idStr;
	private String criadoEm;
	private int qtdFavoritos;
	private boolean favoritado;
	private String descricao;
	
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
	public boolean isFavoritado() {
		return favoritado;
	}
	public void setFavoritado(boolean favoritado) {
		this.favoritado = favoritado;
	}
	public String getDescricao() {
		return descricao;
	}
	public void setDescricao(String descricao) {
		this.descricao = descricao;
	}
	@Override
	public String toString() {
		return "Comentarios [id=" + id + ", idStr=" + idStr + ", criadoEm=" + criadoEm + ", qtdFavoritos="
				+ qtdFavoritos + ", favoritado=" + favoritado + ", descricao=" + descricao + "]";
	}
	
}
