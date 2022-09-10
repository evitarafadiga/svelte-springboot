package br.com.fateczl.ProjetoLibero.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonPOJOBuilder;

@JsonPropertyOrder("assunto")
@JsonDeserialize(builder = Assunto.Builder.class)
public class Assunto {
	
	private Contribuidor contribuidor;
	private Detalhes detalhes;
	private Local local;
	
	private final int id;	
	private final String criadoEm;
	private final int qtdFavoritos;
	private final int qtdCompartilhamento;
	private final String fonte;
	private final String descricao;
	private final String atualizadoEm;
	
	@JsonPOJOBuilder(withPrefix = "")
	@JsonIgnoreProperties(ignoreUnknown = true)
	public static class Builder {
		
		private final int id;
		
		private int qtdFavoritos = 0;
		private int qtdCompartilhamento = 0;
		private String fonte = "Sem fonte";
		private String descricao = "Sem descricao";
		private String criadoEm = "1/1/2022";
		private String atualizadoEm = "1/1/2022";
		
		public Builder(@JsonProperty("id") int id) {
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
		
		public Assunto build() {
			return new Assunto(this);
		}
	}
	
	private Assunto(Builder builder) {
		id = builder.id;
		qtdFavoritos = builder.qtdFavoritos;
		qtdCompartilhamento = builder.qtdCompartilhamento;
		fonte = builder.fonte;
		descricao = builder.descricao;
		criadoEm = builder.criadoEm;
		atualizadoEm = builder.atualizadoEm;
		
	}
	
	public int getId() {
		return id;
	}
	
	public String getCriadoEm() {
		return criadoEm;
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
	
	public String getDescricao() {
		return descricao;
	}
	
	public String getAtualizadoEm() {
		return atualizadoEm;
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
	
	public Detalhes getDetalhes() {
		return detalhes;
	}
	
	public Local getLocal() {
		return local;
	}

}
