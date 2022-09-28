from pytrends.request import TrendReq
pytrend = TrendReq(hl='en-US', tz=360)
keywords = pytrend.suggestions(keyword='Java')
print(keywords)