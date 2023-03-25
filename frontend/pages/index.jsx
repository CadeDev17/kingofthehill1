import Head from 'next/head'
import styles from '../styles/Home.module.css'
import { Contract, providers, utils } from "ethers";
import React, { useEffect, useRef, useState } from "react";
import Web3Modal from "web3modal";
import { KING_OF_THE_HILL_CONTRACT_ADDRESS, KING_OF_THE_HILL_ABI } from "../constants"


export default function Home() {
  const [walletConnected, setWalletConnected] = useState(false) 
  const [loading, setLoading] = useState(false)
  const [isOwner, setIsOwner] = useState(false)
  const [currentKing, setCurrentKing] = useState("");
  const [currentTakeoverPrice, setCurrentTakeoverPrice] = useState(0)
  const [currentTakeoverValue, setCurrentTakeoverValue] = useState(0)

  const web3ModalRef = useRef()

  const getProviderOrSigner = async (needSigner = false) => {
    const provider = await web3ModalRef.current.connect()
    const web3Provider = new providers.Web3Provider(provider)

    const {chainId } = await web3Provider.getNetwork()
    if (chainId !== 5) {
      window.alert("Change network to goerli")
      throw new Error("Change network to goerli")
    }

    if (needSigner) {
      const signer = web3Provider.getSigner()
      return signer
    }

    return web3Provider
  }

  const Takeover = async (value) => {
    try{
      const signer = await getProviderOrSigner(true)
      const KingOfTheHillContract = new Contract(KING_OF_THE_HILL_CONTRACT_ADDRESS, KING_OF_THE_HILL_ABI, signer)
      const tx = await KingOfTheHillContract.takeOver({ value: utils.parseEther(value.toString()) })
      window.alert("You have successfully taken over as King Of The Hill!")
    } catch (err) {
      console.error(err)
    }
  }

  const getCurrentKing = async () => {
    try {
      const provider = await getProviderOrSigner()
      console.log(KING_OF_THE_HILL_CONTRACT_ADDRESS)
      const KingOfTheHillContract = new Contract(KING_OF_THE_HILL_CONTRACT_ADDRESS, KING_OF_THE_HILL_ABI, provider)
      const currentKing = await KingOfTheHillContract._king()
      setCurrentKing(currentKing);
    } catch (err) {
      console.error(err)
    }
  }

  const GetCurrentTakeoverPrice = async () => {
    try{
      const provider = await getProviderOrSigner()
      const KingOfTheHillContract = new Contract(KING_OF_THE_HILL_CONTRACT_ADDRESS, KING_OF_THE_HILL_ABI, provider)
      const currentTakeoverPrice = await KingOfTheHillContract.currentTakeoverPrice()
      const etherValue = utils.formatEther(currentTakeoverPrice.toString())
      console.log(etherValue)
      setCurrentTakeoverPrice(etherValue)
    } catch (err) {
      console.error(err)
    }
  }

  const connectWallet = async () => {
    try {
      await getProviderOrSigner()
      setWalletConnected(true)
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    if (!walletConnected) {
      web3ModalRef.current = new Web3Modal({
        network: "goerli",
        providerOptions: {},
        disableInjectedProvider: false
      })
      connectWallet()
    }
  }, [walletConnected])

  const renderConnectWallet = () => { 
    if (walletConnected) {
      return (
        <button onClick={connectWallet} className={styles.connect}>
          Wallet Connected
        </button>
      )
    } else {
      return (
        <button onClick={connectWallet} className={styles.connect}>
          Connect your wallet
        </button>
      );
    }
  }

  const renderGetKingButton = () => {
    if (walletConnected) {
      return (
        <div>
            <button onClick={getCurrentKing} className={styles.btn}>
              View Current King
            </button>
        </div>
      )
    } else {
      return (
        <button onClick={connectWallet} className={styles.btn}>
          Connect your wallet to see the king
        </button>
      );
    }
  }

  const renderGetCurrentTakeoverPriceButton = () => {
    if (walletConnected) {
      return (
        <div>
            <button onClick={GetCurrentTakeoverPrice} className={styles.btn}>
              View Current Takeover Price
            </button>
        </div>
      )
    } else {
      return (
        <button onClick={connectWallet} className={styles.btn}>
          Connect your wallet to see the current bribe price
        </button>
      );
    }
  }
  
  return (
    <div className={styles.mainContainer}>
      <Head>
        <title>KingOfTheHill</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <nav className={styles.connectWallet}>
          {renderConnectWallet()}
        </nav>
        <section className={styles.landingPage}>
          <div className={styles.description}>
            <p>
              Its like the ethernaut challenge but&nbsp;
              <code className={styles.code}>better</code>
            </p>
            <div>
              <a
                href="hhttps://twitter.com/bitsorbytes"
                target="_blank"
                rel="noopener noreferrer"
              >
                <b>BitsOrBytes</b>
              </a>
            </div>
          </div>

          <div className={styles.center}>
            <h1 className={styles.landingTitle}>King Of The Hill</h1>
          </div>

          <div className={styles.grid}>
            <a
              className={styles.card}
            >
              <h2>
                The Hunt <span>-&gt;</span>
              </h2>
              <p>
                Locate the current King and how much he paid to become the monarch.
              </p>
            </a>

            <a
              className={styles.card}
            >
              <h2>
                The Bribe <span>-&gt;</span>
              </h2>
              <p>
                Pay the King's henchmen more money than the King does himself
              </p>
            </a>

            <a
              className={styles.card}
            >
              <h2>
                The Takeover <span>-&gt;</span>
              </h2>
              <p>
                Take over the King's throne
              </p>
            </a>

            <a
              className={styles.card}
            >
              <h2>
                The Legacy <span>-&gt;</span>
              </h2>
              <p>
                Build your legacy and protect your kingdom for as long as you can!
              </p>
            </a>
          </div>
        </section>
        <section className={styles.infoSection}>
          <div className={styles.infoContainer}>
            <h2>Gather all the info you need to execute your attack!</h2>
            <div className={styles.info}>
              {renderGetKingButton()}
              <p>The currently reigning king is: {currentKing || "______________________"}</p>
            </div>
            <div className={styles.info}>
              {renderGetCurrentTakeoverPriceButton()}
              <p>The currently accepted bribe price is: {currentTakeoverPrice || "_____"}ETH</p>
            </div>
          </div>
        </section>
        <section className={styles.takeoverSection}>
          <div className={styles.takeoverContainer}>
            <h2>Execute your attack!</h2>
            <div className={styles.takeoverTx}>
              <label>Enter your bribe amount:</label>
              <input type="number" placeholder="Enter ETH Amount" name="takeoverAmount" onChange={(e) => setCurrentTakeoverValue(e.target.value)} />
              <button className={styles.btn} onClick={() => Takeover(currentTakeoverValue)}>TAKEOVER</button>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
