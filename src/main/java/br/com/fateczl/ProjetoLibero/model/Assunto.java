package br.com.fateczl.ProjetoLibero.model;

public class Assunto {
	
	private Contribuidor contribuidor;
	private Detalhes detalhes;
	private Local local;
	
	private int id;	
	private String criadoEm;
	private int qtdFavoritos;
	private int qtdCompartilhamento;
	private String fonte;
	private String descricao;
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
	public String getAtualizadoEm() {
		return atualizadoEm;
	}
	public void setAtualizadoEm(String atualizadoEm) {
		this.atualizadoEm = atualizadoEm;
	}
	@Override
	public String toString() {
		return "\nAssunto [id=" + id + ", criadoEm=" + criadoEm + ", qtdFavoritos=" + qtdFavoritos
				+ ", qtdCompartilhamento=" + qtdCompartilhamento + ", fonte=" + fonte + ", descricao=" + descricao 
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
