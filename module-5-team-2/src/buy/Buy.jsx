import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import arrow from "../img/arrow.svg";
import { addNewStock, changeBalance,getUserBalance} from "../fetcher/Fetcher";


// Стили Компонента Buy начало ****
const MainBuy = styled.div`
display: flex;
justify-content: center;
align-items: center;
flex-direction: column;
  width: 100%;
  text-align: center;
`;
const CentralBlock = styled.div`
  a {
    text-decoration: none;
  }
  a p {
    width: 170px;
    padding: 15px 20px;
    border: 3px solid #833ae0;
    border-radius: 49px;
    color: #833ae0;
    margin: 0 auto;
  }
  a p:hover {
    background-color: blueviolet;
    border: 3px solid #ffffff;
    color: #ffffff;
  }
  span{
  font-size: 15px;
  }
`;
const HeaderBuy = styled.div`
  display: flex;
  width: 100%;
  padding-bottom: 56px;
  padding-top: 30px;
  box-shadow: 0 13px 5px -4px rgba(0, 0, 0, 0.15);
  a {
    text-decoration: none;
    color: blueviolet;
    font-size: 18px;
  }
  h2 {
    text-align: center;
    word-break: break-word;
    font-size: 28px;
    flex-basis: 92%;
    color: #2fc20a;

  }
  img {
    width: 12px;
  }
`;
const PriceText = styled.p`
  font-family: Roboto, sans-serif;
  font-style: normal;
  font-weight: normal;
  font-size: 30px;
  line-height: 14px;
  padding-top: 56px;
  padding-bottom: 66px;
`;
const BuyFor = styled.p`
  font-family: Roboto, sans-serif;
  font-size: 20px;
  line-height: 14px;
  padding-top: 66px;
  padding-bottom: 47px;
`;
const InputBlock = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  margin: 0 auto;
  button {
    color: blueviolet;
    background-color: transparent;
    cursor: pointer;
    font-size: 30px;
    padding: 10px;
    border: none;
    outline: none;
  }
`;
const InputLenght = styled.input`
    width: 100px;
    font-size: 50px;
    color: blueviolet;
    text-align: center;
    border: none;
    outline: none;
`;
// Стили Компонента Buy Конец ****


class Buy extends React.Component {
  state = {
    name: null,
    price: null,
    symbol: null,
    balance:null,
    pieces: 0,
  };
  componentDidMount() {
    const { name, price, symbol } = this.props.location.state; //Беру state из тега Link в компоненте Stock
    if (!this.state.name) {
      this.setState({ name: name, price: price, symbol: symbol }); // Записываю их в state текущего компонента
    }
    getUserBalance().then(result => this.setState({balance:result.currentBalance})) // Записываю в state balance баланс с API
  }
  // Функция выделяющая числа после точки для ее уменьшения в стилях в дальнейшем
  numberAfterDot = (value) =>{
        if(value) {
            value.toFixed(2);
            value = value+'';
            const digits = value.substring(value.indexOf('.') + 1);
            return '.'+ digits.substring(0,2);
        }
        else return null;
  };
  // Функция увеличения значения в input
  handlerPlus = () => {
    this.setState({ pieces: +(this.state.pieces) + 1 });
  };
    // Функция уменьшения значения в input
  handlerMinus = () => {
      if(this.state.pieces===0) this.setState({ pieces: 0 });
      else this.setState({ pieces: +(this.state.pieces) - 1 });
  };
  //Функция отправки полученных данных на API команды начало ****
  sendToUserStock = () => {
    const objectOfData = {
      name: `${this.state.name}`,
      price: `${this.state.price}`,
      symbol: `${this.state.symbol}`,
      pieces: `${this.state.pieces}`,
    };
      const elements = this.state.pieces*this.state.price;
      if(elements>this.state.balance) alert('Недостаточно средств');
      else {
          const currentBalance = this.state.balance - elements;
          changeBalance(currentBalance);
      }
    return addNewStock(objectOfData);
  };
 //Функция отправки полученных данных на API команды конец ****

 // Функция записывающая текущее значение value input  в state pieces
  changeValue = (e) => {
    this.setState({ pieces: e.target.value });
      if(e.target.value.length===0) e.target.style.width=`100px`;
      else {
          e.target.style.width = ((e.target.value.length + 20) * 8) + 'px'; // Динамическое расширение и уменьшения поля input в зависимости от введенного значения
      }
      parseInt(e.target.value);
  };


  render() {
    return (
      <MainBuy>
        <HeaderBuy>
          <Link to={"/Stock"}>
            <img src={arrow} alt="arrow" />
            Back
          </Link>
          <h2>Buy {this.state.name}</h2>
        </HeaderBuy>
        <CentralBlock>
          <PriceText>{Math.trunc(this.state.price)}<span>{this.numberAfterDot(this.state.price)} $</span></PriceText>
          <InputBlock >
            <button onClick={this.handlerMinus}>-</button>
            <InputLenght
              type="text"
              onChange={this.changeValue}
              value={this.state.pieces}
            />
            <button onClick={this.handlerPlus}>+</button>
          </InputBlock>
          <BuyFor>
            Buy for {Math.trunc(this.state.pieces * this.state.price)}
            <span>{this.numberAfterDot(this.state.pieces * this.state.price)} $</span>
          </BuyFor>
          <Link to={"/Stock"}>
            <p onClick={this.sendToUserStock}>Buy</p>
          </Link>
        </CentralBlock>
      </MainBuy>
    );
  }
}
export default Buy;
