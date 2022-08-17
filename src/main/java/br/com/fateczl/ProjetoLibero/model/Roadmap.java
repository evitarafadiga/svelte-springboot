package br.com.fateczl.ProjetoLibero.model;

public class Roadmap {

	private final int id;
	private final String criadoEm;
	private final int qtdFavoritos;
	private final int qtdCompartilhamento;
	private final String fonte;
	private final String nome;
	private final String descricao;
	private final String atualizadoEm;

	public static class Builder {
		// exigencias
		private final int id;

		// opcionais
		private int qtdFavoritos = 0;
		private int qtdCompartilhamento = 0;
		private String fonte = "Sem fonte";
		private String nome = "Sem nome";
		private String descricao = "Sem descricao";
		private String criadoEm = "1/1/2022";
		private String atualizadoEm = "1/1/2022";

		public Builder(int id) {
			this.id = id;
		}

		public Builder qtdFavoritos(int val) {
			qtdFavoritos = val;
			return this;
		}

		public Builder qtdCompartilhamento(int val) {
			qtdCompartilhamento = val;
			return this;
		}

		public Builder fonte(String val) {
			fonte = val;
			return this;
		}

		public Builder nome(String val) {
			nome = val;
			return this;
		}

		public Builder descricao(String val) {
			descricao = val;
			return this;
		}

		public Builder criadoEm(String val) {
			criadoEm = val;
			return this;
		}

		public Builder atualizadoEm(String val) {
			atualizadoEm = val;
			return this;
		}

		public Roadmap build() {
			return new Roadmap(this);
		}

	}
	
	private Roadmap(Builder builder) {
		id = builder.id;
		qtdFavoritos = builder.qtdFavoritos;
		qtdCompartilhamento = builder.qtdCompartilhamento;
		fonte = builder.fonte;
		nome = builder.nome;
		descricao = builder.descricao;
		criadoEm = builder.criadoEm;
		atualizadoEm = builder.atualizadoEm;
		
	}
	
	public int getId() {
		return id;
	}

	public int getQtdFavoritos() {
		return qtdFavoritos;
	}

	public int getQtdCompartilhamento() {
		return qtdCompartilhamento;
	}

	public String getFonte() {
		return fonte;
	}

	public String getNome() {
		return nome;
	}

	public String getDescricao() {
		return descricao;
	}

	public String getCriadoEm() {
		return criadoEm;
	}

	public String getAtualizadoEm() {
		return atualizadoEm;
	}

	@Override
	public String toString() {
		return "\nRoadmap [id=" + id + ", criadoEm=" + criadoEm + ", qtdFavoritos=" + qtdFavoritos
				+ ", qtdCompartilhamento=" + qtdCompartilhamento + ", fonte=" + fonte + ", descricao=" + descricao
				+ ", nome=" + nome + ", atualizadoEm=" + atualizadoEm + "]";
	}

}
