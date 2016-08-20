{
  const ACTION = {
    ADD: 'add',
    REMOVE: 'remove'
  };

  const WalletMenu = React.createClass({
    handleReset(e){
      e.preventDefault();

      this.props.onReset();
    },
    render(){

      return (
        <header className="header clearfix">
          <div className="container">
            <h1 className="logo pull-left">
              <a href="#">
                <span className="logo-title">Wallet</span>
              </a>
            </h1>
            <nav id="main-nav" className="main-nav navbar-right" role="navigation">
              <div className="navbar-header">
                <button className="navbar-toggle" type="button" data-toggle="collapse"
                        data-target="#navbar-collapse">
                  <span className="sr-only">Toggle navigation</span>
                  <span className="icon-bar"></span>
                  <span className="icon-bar"></span>
                  <span className="icon-bar"></span>
                </button>
              </div>
              <div className="navbar-collapse collapse" id="navbar-collapse">
                <ul className="nav navbar-nav">
                  <li className="nav-item"><a href="#">Home</a></li>
                  <li className="nav-item">
                    <a href="#" onClick={this.handleReset}>Reset</a>
                  </li>
                  <li className="nav-item"><a href="#">Source code</a></li>
                </ul>
              </div>
            </nav>
          </div>
        </header>
      )
    }
  });

  const AmountTotal = React.createClass({
    render() {
      const total = this.props.total;
      return (
        <div>
          <h2 className="title">{total} <span className="highlight">$</span></h2>
          <p className="intro">Disponible amount</p>
        </div>
      );
    }
  });

  const ErrorBox = React.createClass({
    render(){
      return (
        <img src="src/css/error.jpg" alt="..." className="center-block img-rounded img-responsive"/>
      );
    }
  });

  const AmountForm = React.createClass({
    getInitialState() {
      return { amount: '', error: false }
    },
    handleAmountChange(e) {
      const reg = /^\d+$/;
      const amount = e.target.value;

      this.setState({ amount, error: !reg.test(amount) });
    },
    handleAction(type) {
      const amount = this.state.amount.trim();
      const error = this.state.error;

      if(!amount || error) return;

      this.props.onClickButton(amount, type);

      this.setState({author: ''});
    },
    render() {
      const amount = this.state.amount.trim();
      const error = this.state.error;

      return (
        <div className="btns col-md-offset-3 col-md-6">
          <form >
            <div className="form-group">
              <input
                type="text"
                className="form-control"
                placeholder="Amount"
                value={amount}
                onChange={this.handleAmountChange}/>
              {
                error && amount ? <ErrorBox/> : null
              }

            </div>

            <button type="button"
                    className="btn btn-cta-secondary btn-lg btn-block"
                    onClick={() => this.handleAction(ACTION.ADD)}
                    disabled={error}>
              <i className="glyphicon glyphicon-log-in"></i> Add
            </button>
            <button type="button"
                    className="btn btn btn-cta-primary btn-lg btn-block"
                    onClick={() => this.handleAction(ACTION.REMOVE)}
                    disabled={error}>
              <i className="glyphicon glyphicon-log-out"></i> Remove
            </button>
          </form>
        </div>
      );
    }
  });

  const AmountBox = React.createClass({
    render() {
      const total = this.props.total;
      const onClickButton = this.props.onClickButton;

      return (
        <section className="promo section offset-header">
          <div className="container text-center">
            <AmountTotal total={total} />
            <AmountForm onClickButton={onClickButton}/>
          </div>
        </section>
      );
    }
  });




  const WalletBox = React.createClass({
    resetHistory() {
      console.log('reset')
      this.setState({ data: [], totalAmount: 0 });
    },
    handleAction(amount, type) {
      const parsedAmount = parseInt(amount);
      const total = this.state.totalAmount + (type === ACTION.ADD ? parsedAmount : parsedAmount * (-1));
      const item = {
        type,
        date: new Date().toString(),
        amount: parsedAmount
      };
      const data = this.state.data.concat([item]);

      console.log('data', data)

      this.setState({ data, totalAmount: total });
    },
    getInitialState() {
      return { data: [], totalAmount: 15 };
    },
    componentDidMount() {

    },
    render() {

      return (
        <div>
          <WalletMenu onReset={this.resetHistory}/>
          <AmountBox total={this.state.totalAmount}
                     onClickButton={this.handleAction}/>
        </div>
      );
    }
  });

  ReactDOM.render(
    <WalletBox />,
    document.getElementById('view')
  );
}
