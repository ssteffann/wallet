{
  const ACTION = {
    ADD: 'add',
    REMOVE: 'remove',
    FORMAT: 'MMMM Do YYYY, h:mm:ss a'
  };

  /**
   * Wallet menu
   */
  const WalletMenu = React.createClass({
    handleReset(e){
      e.preventDefault();

      this.props.onReset();
    },
    render() {
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
                  <li className="nav-item"><a href="/">Home</a></li>
                  <li className="nav-item">
                    <a href="#" onClick={this.handleReset}>Reset</a>
                  </li>
                  <li className="nav-item">
                    <a target="blank" href="https://github.com/ssteffann/wallet">Source code</a>
                  </li>
                </ul>
              </div>
            </nav>
          </div>
        </header>
      )
    }
  });

  /**
   * Amount Box
   */
  const AmountTotal = React.createClass({
    render() {
      const total = this.props.total;
      return (
        <div>
          <h2 className="title">{total} <span className="highlight">$</span></h2>
          <p className="intro">Available amount</p>
        </div>
      );
    }
  });

  const ErrorBox = React.createClass({
    render(){
      const url = this.props.url;

      return (<img src={url} className="center-block img-responsive"/>);
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
      const { amount, error } = this.state;

      if(!amount || error) return;

      this.props.onClickButton(amount, type);

      this.setState({ amount: '' });
    },
    render() {
      const { amount, error } = this.state;
      const enoughAmount = this.props.enoughAmount;

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
              { error && amount ? <ErrorBox url="src/css/error.jpg"/> : null }
              { !enoughAmount && !error ? <ErrorBox url="src/css/empty.jpg"/> : null }
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
      const { enoughAmount, total, onClickButton } = this.props;

      return (
        <section className="promo section offset-header">
          <div className="container text-center">
            <AmountTotal total={total} />
            <AmountForm onClickButton={onClickButton} enoughAmount={enoughAmount}/>
          </div>
        </section>
      );
    }
  });

  /**
   * History Box
   */
  const HistoryItem = React.createClass({
    getTrClass(type) {
      return `text-center text-${type === ACTION.ADD ? 'success' : 'danger'}`;
    },
    getIconClass(type) {
      return `glyphicon glyphicon-log-${type === ACTION.ADD ? 'in' : 'out'}`;
    },
    render() {
      const { type, amount } = this.props;
      const date = moment(this.props.date).format(ACTION.FORMAT);

      return (
        <tr className={this.getTrClass(type)}>
          <td>
            <i className={this.getIconClass(type)}></i>
          </td>
          <td><strong>{date}</strong></td>
          <td className="text-right"><strong>{amount} $</strong></td>
        </tr>
      );
    }
  });

  const HistoryList = React.createClass({
    render() {
      const historyItems = this.props.data.map((item, index) => {
        return (
          <HistoryItem type={item.type}
                       key={index}
                       amount={item.amount}
                       date={item.date} />
        );
      });

      return (
        <section className="section">
          <div className="container">
            <table className="table table-hover table-responsive">
              <tbody>
              <tr className="highlight">
                <th className="text-center">Action:</th>
                <th className="text-center">Date:</th>
                <th className="text-right">Amount:</th></tr>
              {historyItems}
              </tbody>
            </table>
          </div>
        </section>
      );
    }
  });

  /**
   * Wallet Box
   */
  const WalletBox = React.createClass({
    resetHistory() {
      this.setState({ data: [], totalAmount: 0, enoughAmount: true });
    },
    handleAction(amount, type) {
      const parsedAmount = parseInt(amount);
      const total = this.state.totalAmount + (type === ACTION.ADD ? parsedAmount : parsedAmount * (-1));

      if(total < 0) return this.setState({ enoughAmount: false });

      const item = {
        type,
        date: moment.utc().format(),
        amount: parsedAmount
      };
      const data = [item].concat(this.state.data);

      this.setState({ data, totalAmount: total, enoughAmount: true });
      localStorage.setItem('walletData', JSON.stringify({ data, totalAmount: total }));
    },
    getInitialState() {
      return { data: [], totalAmount: 0,  enoughAmount: true };
    },
    componentDidMount() {
      const localData = localStorage.getItem('walletData');

      if(localData){
        this.setState(JSON.parse(localData));
      }
    },
    render() {

      return (
        <div>
          <WalletMenu onReset={this.resetHistory}/>
          <AmountBox total={this.state.totalAmount}
                     enoughAmount={this.state.enoughAmount}
                     onClickButton={this.handleAction}/>
          <HistoryList data={this.state.data} />
        </div>
      );
    }
  });

  ReactDOM.render(
    <WalletBox />,
    document.getElementById('view')
  );
}
