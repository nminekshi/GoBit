jest.mock("../models/Auction", () => ({
  findById: jest.fn(),
}));

jest.mock("../models/User", () => ({
  findById: jest.fn(),
}));

jest.mock("../models/AutoBidSetting", () => ({
  find: jest.fn(),
}));

jest.mock("../utils/fraudDetection", () => ({
  detectBidFraud: jest.fn(async () => ({
    riskScore: 0,
    isSuspicious: false,
    flags: [],
  })),
}));

const Auction = require("../models/Auction");
const User = require("../models/User");
const AutoBidSetting = require("../models/AutoBidSetting");
const { processAutoBids } = require("../services/auctionService");

describe("processAutoBids", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("places an auto bid when a valid bot is outbid", async () => {
    const auctionId = "507f1f77bcf86cd799439011";
    const sellerId = "507f1f77bcf86cd799439012";
    const leaderId = "507f1f77bcf86cd799439013";
    const botId = "507f1f77bcf86cd799439014";

    const auctionDoc = {
      _id: auctionId,
      status: "active",
      category: "electronics",
      sellerId,
      currentBid: 100,
      bidsCount: 0,
      bids: [
        {
          bidderId: leaderId,
          bidAmount: 100,
          timestamp: new Date(),
        },
      ],
      save: jest.fn(async function save() {
        return this;
      }),
      populate: jest.fn(async function populate() {
        return this;
      }),
    };

    Auction.findById.mockResolvedValue(auctionDoc);

    const sortMock = jest
      .fn()
      .mockResolvedValueOnce([
        {
          userId: botId,
          maxBid: 140,
          increment: 10,
        },
      ])
      .mockResolvedValueOnce([]);

    AutoBidSetting.find.mockReturnValue({ sort: sortMock });

    User.findById.mockResolvedValue({ _id: botId, username: "bot-user" });

    const emit = jest.fn();
    const to = jest.fn(() => ({ emit }));
    const io = { to };

    await processAutoBids(auctionId, io);

    expect(auctionDoc.currentBid).toBe(110);
    expect(auctionDoc.bids[auctionDoc.bids.length - 1].isAutoBid).toBe(true);
    expect(User.findById).toHaveBeenCalledWith(botId);
    expect(to).toHaveBeenCalled();
    expect(emit).toHaveBeenCalledWith("auction:update", auctionDoc);
  });

  it("handles competing auto-bidders until limits are reached", async () => {
    const auctionId = "507f1f77bcf86cd799439021";
    const sellerId = "507f1f77bcf86cd799439022";
    const manualLeaderId = "507f1f77bcf86cd799439023";
    const botAId = "507f1f77bcf86cd799439024";
    const botBId = "507f1f77bcf86cd799439025";

    const auctionDoc = {
      _id: auctionId,
      status: "active",
      category: "electronics",
      auctionType: "normal",
      sellerId,
      currentBid: 100,
      bidsCount: 0,
      bids: [
        {
          bidderId: manualLeaderId,
          bidAmount: 100,
          timestamp: new Date(),
        },
      ],
      save: jest.fn(async function save() {
        return this;
      }),
      populate: jest.fn(async function populate() {
        return this;
      }),
    };

    Auction.findById.mockResolvedValue(auctionDoc);

    AutoBidSetting.find.mockReturnValue({
      sort: jest.fn().mockResolvedValue([
        { userId: botAId, maxBid: 130, increment: 10 },
        { userId: botBId, maxBid: 120, increment: 10 },
      ]),
    });

    User.findById.mockImplementation(async (id) => ({ _id: id, username: `u-${id.slice(-4)}` }));

    const emit = jest.fn();
    const to = jest.fn(() => ({ emit }));
    const io = { to };

    await processAutoBids(auctionId, io);

    expect(auctionDoc.currentBid).toBe(130);
    expect(auctionDoc.bids.length).toBe(4);
    expect(auctionDoc.bids[1].bidderId.toString()).toBe(botAId);
    expect(auctionDoc.bids[1].bidAmount).toBe(110);
    expect(auctionDoc.bids[2].bidderId.toString()).toBe(botBId);
    expect(auctionDoc.bids[2].bidAmount).toBe(120);
    expect(auctionDoc.bids[3].bidderId.toString()).toBe(botAId);
    expect(auctionDoc.bids[3].bidAmount).toBe(130);
    expect(auctionDoc.bids[3].isAutoBid).toBe(true);
  });
});
