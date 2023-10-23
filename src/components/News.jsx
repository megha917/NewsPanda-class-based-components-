import React, { Component } from "react";
import NewsItem from "./NewsItem";
import "./News.css";
import Spinner from "./Spinner";
import PropTypes from "prop-types";
import InfiniteScroll from "react-infinite-scroller";

export class News extends Component {
  static defaultProps = {
    country: "in",
    pageSize: 10,
    category: "general",
  };

  static propTypes = {
    country: PropTypes.string,
    pageSize: PropTypes.number,
    category: PropTypes.string,
  };

  capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  constructor(props) {
    super(props);
    this.state = {
      articles: [],
      loading: true,
      page: 1,
      totalResults: 0,
    };
    document.title = `${this.capitalizeFirstLetter(
      this.props.category
    )} - NewsPanda`;
  }

  async updateNews(pageNo) {
    this.props.setProgress(10);
    const url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=${this.props.apiKey}&page=${this.state.page}&pageSize=${this.props.pageSize}`;
    this.setState({ loading: true });
    let data = await fetch(url);
    this.props.setProgress(30);
    let parsedData = await data.json();
    this.props.setProgress(70);
    this.setState({
      articles: parsedData.articles ? parsedData.articles : [],
      totalResults: parsedData.totalResults,
      loading: false,
    });
    this.props.setProgress(100);
  }

  async componentDidMount() {
    this.updateNews();
  }

  fetchMoreData = async () => {
    if (this.state.loading) {
      return;
    }

    let newPage = this.state.page + 1;
    this.setState({ page: newPage, loading: true });

    const url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=${this.props.apiKey}&page=${newPage}&pageSize=${this.props.pageSize}`;

    let data = await fetch(url);
    let parsedData = await data.json();

    this.setState({
      articles: this.state.articles.concat(
        parsedData.articles ? parsedData.articles : []
      ),
      totalResults: parsedData.totalResults,
      loading: false,
    });
  };

  backgroundStyle = {
    backgroundImage: 'url("newspaper.jpg")',
    backgroundSize: "contain",
    backgroundPosition: "center",
    width: "100%",
  };

  render() {
    return (
      <div className="container-fluid m-0 p-0" style={this.backgroundStyle}>
        <div className="container bg-news-img">
          <h1  className="mb-2 pb-3 pt-5 text-center"
          style={{ marginTop: "4rem" }}>
            NewsPanda - Top {this.capitalizeFirstLetter(this.props.category)}{" "}
            Headlines
          </h1>
          {this.state.loading && <Spinner />}

          <InfiniteScroll
            key="infinite-scroll"
            pageStart={0}
            loadMore={this.fetchMoreData}
            hasMore={this.state.articles.length < this.state.totalResults}
            loader={<Spinner />}
          >
            <div className="row">
              {this.state.articles.map((element) => (
                <div className="col-md-12" key={element.url}>
                  <NewsItem
                    key={element.url}
                    title={element.title}
                    description={element.description}
                    imageUrl={element.urlToImage}
                    newsUrl={element.url}
                    author={element.author}
                    date={element.publishedAt}
                    source={element.source.name}
                  />
                </div>
              ))}
            </div>
          </InfiniteScroll>
        </div>
        <div className="container d-flex justify-content-evenly mt-3 pb-5"></div>
      </div>
    );
  }
}

export default News;
