package br.com.fateczl.ProjetoLibero.model;

public class AssuntosDeUsuario {
	
	private Assunto assunto;
	private Usuario usuario;
	private boolean estudado;
	public Assunto getAssunto() {
		return assunto;
	}
	public void setAssunto(Assunto assunto) {
		this.assunto = assunto;
	}
	public Usuario getUsuario() {
		return usuario;
	}
	public void setUsuario(Usuario usuario) {
		this.usuario = usuario;
	}
	public boolean isEstudado() {
		return estudado;
	}
	public void setEstudado(boolean estudado) {
		this.estudado = estudado;
	}
	@Override
	public String toString() {
		return "AssuntosDeUsuario [assunto=" + assunto + ", usuario=" + usuario + ", estudado=" + estudado + "]";
	}
	
	
}
