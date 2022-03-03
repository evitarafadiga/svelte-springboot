package br.com.fateczl.ProjetoLibero.model;

public class Assunto {
	
	private Contribuidor contribuidor;
	private Detalhes detalhes;
	private Local local;
	
	private int id;
	private String idStr;	
	private String criadoEm;
	private int qtdFavoritos;
	private boolean favoritado;
	private int qtdCompartilhamento;
	private boolean compartilhado;
	private String fonte;
	private String descricao;
	private boolean estudado;
	private String atualizadoEm;
	
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
	public int getQtdCompartilhamento() {
		return qtdCompartilhamento;
	}
	public void setQtdCompartilhamento(int qtdCompartilhamento) {
		this.qtdCompartilhamento = qtdCompartilhamento;
	}
	public boolean isCompartilhado() {
		return compartilhado;
	}
	public void setCompartilhado(boolean compartilhado) {
		this.compartilhado = compartilhado;
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
	public boolean isEstudado() {
		return estudado;
	}
	public void setEstudado(boolean estudado) {
		this.estudado = estudado;
	}
	public String getAtualizadoEm() {
		return atualizadoEm;
	}
	public void setAtualizadoEm(String atualizadoEm) {
		this.atualizadoEm = atualizadoEm;
	}
	@Override
	public String toString() {
		return "\nAssunto [id=" + id + ", idStr=" + idStr + ", criadoEm=" + criadoEm + ", qtdFavoritos=" + qtdFavoritos
				+ ", favoritado=" + favoritado + ", qtdCompartilhamento=" + qtdCompartilhamento + ", compartilhado="
				+ compartilhado + ", fonte=" + fonte + ", descricao=" + descricao + ", estudado=" + estudado
				+ ", atualizadoEm=" + atualizadoEm + "]";
	}
	public Contribuidor getContribuidor() {
		return contribuidor;
	}
	public void setContribuidor(Contribuidor contribuidor) {
		this.contribuidor = contribuidor;
	}
	public Detalhes getDetalhes() {
		return detalhes;
	}
	public void setDetalhes(Detalhes detalhes) {
		this.detalhes = detalhes;
	}
	public Local getLocal() {
		return local;
	}
	public void setLocal(Local local) {
		this.local = local;
	}

}
