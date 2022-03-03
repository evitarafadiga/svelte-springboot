package br.com.fateczl.ProjetoLibero.model;

import java.util.Arrays;

public class Usuario {
	private int id;
	private String idStr;
	private String criadoEm;
	private String email;
	private String senha;
	private boolean imagemPadrao;
	private String descricao;
	private int qtdFavoritos;
	private String lingua;
	private String locacao;
	private String nome;
	private boolean notificacoes;
	private String imagemDoPerfilUrl;
	private boolean contribuidor;
	private boolean staff;
	private boolean professor;
	private String[] carreiras;
	
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
	@Override
	public String toString() {
		return "Usuario [id=" + id + ", idStr=" + idStr + ", criadoEm=" + criadoEm + ", email=" + email + ", senha="
				+ senha + ", imagemPadrao=" + imagemPadrao + ", descricao=" + descricao + ", qtdFavoritos="
				+ qtdFavoritos + ", lingua=" + lingua + ", locacao=" + locacao + ", nome=" + nome + ", notificacoes="
				+ notificacoes + ", imagemDoPerfilUrl=" + imagemDoPerfilUrl + ", contribuidor=" + contribuidor
				+ ", staff=" + staff + ", professor=" + professor + ", carreiras=" + Arrays.toString(carreiras) + "]";
	}
	public String getEmail() {
		return email;
	}
	public void setEmail(String email) {
		this.email = email;
	}
	public String getSenha() {
		return senha;
	}
	public void setSenha(String senha) {
		this.senha = senha;
	}
	public boolean isImagemPadrao() {
		return imagemPadrao;
	}
	public void setImagemPadrao(boolean imagemPadrao) {
		this.imagemPadrao = imagemPadrao;
	}
	public String getDescricao() {
		return descricao;
	}
	public void setDescricao(String descricao) {
		this.descricao = descricao;
	}
	public int getQtdFavoritos() {
		return qtdFavoritos;
	}
	public void setQtdFavoritos(int qtdFavoritos) {
		this.qtdFavoritos = qtdFavoritos;
	}
	public String getLingua() {
		return lingua;
	}
	public void setLingua(String lingua) {
		this.lingua = lingua;
	}
	public String getLocacao() {
		return locacao;
	}
	public void setLocacao(String locacao) {
		this.locacao = locacao;
	}
	public String getNome() {
		return nome;
	}
	public void setNome(String nome) {
		this.nome = nome;
	}
	public boolean isNotificacoes() {
		return notificacoes;
	}
	public void setNotificacoes(boolean notificacoes) {
		this.notificacoes = notificacoes;
	}
	public String getImagemDoPerfilUrl() {
		return imagemDoPerfilUrl;
	}
	public void setImagemDoPerfilUrl(String imagemDoPerfilUrl) {
		this.imagemDoPerfilUrl = imagemDoPerfilUrl;
	}
	public boolean isContribuidor() {
		return contribuidor;
	}
	public void setContribuidor(boolean contribuidor) {
		this.contribuidor = contribuidor;
	}
	public boolean isStaff() {
		return staff;
	}
	public void setStaff(boolean staff) {
		this.staff = staff;
	}
	public boolean isProfessor() {
		return professor;
	}
	public void setProfessor(boolean professor) {
		this.professor = professor;
	}
	public String[] getCarreiras() {
		return carreiras;
	}
	public void setCarreiras(String[] carreiras) {
		this.carreiras = carreiras;
	}
}
