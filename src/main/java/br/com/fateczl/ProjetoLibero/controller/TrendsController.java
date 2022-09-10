package br.com.fateczl.ProjetoLibero.controller;

import org.junit.Test;
import org.springframework.beans.factory.annotation.Value;

import twitter4j.Location;
import twitter4j.Trend;
import twitter4j.Twitter;
import twitter4j.TwitterException;
import twitter4j.TwitterFactory;
import twitter4j.api.TrendsResources;
import twitter4j.conf.ConfigurationBuilder;

public class TrendsController {
	
	@Value("${ckey}")
	public String cKey;
	@Value("${ckeySecret}")
	public String cKeySecret;
	@Value("${bearerToken}")
	public String bearerToken;
	@Value("${aToken}")
	public String aToken;
	@Value("${aTokenSecret}")
	public String aTokenSecret;
	
	@Test
	public void connect() throws TwitterException {
		ConfigurationBuilder cb = new ConfigurationBuilder();
		cb.setDebugEnabled(false)
		.setOAuthConsumerKey(cKey)
		.setOAuthConsumerSecret(cKeySecret)
		.setOAuth2AccessToken(bearerToken)
		.setOAuthAccessToken(aToken)
		.setOAuthAccessTokenSecret(aTokenSecret);
		
		TwitterFactory tf = new TwitterFactory(cb.build());
		Twitter twitter = tf.getInstance();
		
		
		TrendsResources trends = twitter.trends();
		System.out.println(trends);
		
		 for (Location location : twitter.trends().getAvailableTrends()) {
		      for (Trend trend : twitter.trends().getPlaceTrends(location.getWoeid()).getTrends()) {
		        System.out.printf("Local: %s, tendência: %s", location, trend);
		      }
		    }
	}

}
