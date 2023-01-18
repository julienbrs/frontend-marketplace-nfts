import NftItem from "../components/NftItem"
import { React, useEffect } from "react"
import { useNotification } from "web3uikit"
import { useMoralis } from "react-moralis"
import networkMapping from "../constants/networkMapping.json"
import GET_ACTIVE_ITEMS from "../constants/subgraphQueries"
import { useQuery } from "@apollo/client"

export default function Home() {
    const { isWeb3Enabled, chainId } = useMoralis()
    const chainIdDecimal = chainId ? parseInt(chainId).toString() : null
    let marketplaceAddress
    const dispatch = useNotification()
    updateAddress()

    // Old NFTs to populate the collection, delist would take too mucht time but we don't want to display them
    const oldCollection = "0x8ba708888ab6a79b067c5c2d00d0ff723a51639e"

    const { loading, data: listedNfts } = useQuery(GET_ACTIVE_ITEMS)
    function updateAddress() {
        if (chainIdDecimal in networkMapping) {
            marketplaceAddress = chainId ? networkMapping[chainIdDecimal].NftMarketplace[0] : null
        }
    }

    function checkEnable() {
        if (isWeb3Enabled) {
            console.log("A")
            updateAddress()
            console.log(marketplaceAddress)
            if (marketplaceAddress != "") {
                console.log("Z")
                return true
            } else {
                dispatch({
                    type: "error",
                    title: "Chain not handled",
                    message: "Please connect to Goerli testnet",
                    position: "topR",
                })
                console.log("Z")
                return false
            }
        } else {
            dispatch({
                type: "error",
                title: "Web3 not connected",
                message: "Please connect to Goerli testnet",
                position: "topR",
            })
            console.log("Z")
            return false
        }
    }
    return (
        <div className="pt-2 h-full px-24 pl-28">
            <h1 className="pt-10 pb-5 font-bold text-2xl text-deepblue">Recently Listed</h1>
            <div className="flex flex-wrap">
                {isWeb3Enabled ? (
                    marketplaceAddress ? (
                        loading || !listedNfts ? (
                            <div className="text-deepblue font-extrabold pr-8">Loading... </div>
                        ) : (
                            listedNfts.activeItems.map((nft) => {
                                const { price, nftAddress, tokenId, seller } = nft
                                updateAddress()
                                if (nftAddress != oldCollection)
                                    return (
                                        <div key={`${nftAddress}:${tokenId}`}>
                                            <NftItem
                                                price={price}
                                                nftAddress={nftAddress}
                                                tokenId={tokenId}
                                                marketplaceAddress={marketplaceAddress}
                                                seller={seller}
                                                key={`${nftAddress}:${tokenId}:`}
                                            ></NftItem>
                                        </div>
                                    )
                            })
                        )
                    ) : (
                        <div className="text-[#EF4444] font-bold font-xl pr-8">
                            Please connect to Goerli testnet{" "}
                        </div>
                    )
                ) : (
                    <div className="text-[#EF4444] font-bold font-xl pr-8">
                        Web3 not connected{" "}
                    </div>
                )}
            </div>
        </div>
    )
}
