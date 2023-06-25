import { createPagesBrowserClient } from "@supabase/auth-helpers-nextjs";

const respondActivityJSON = (res, json) => {
    res.statusCode = 200;
    res.setHeader("Content-Type", "application/activity+json");
    res.end(JSON.stringify(json));
};

const supabase = createPagesBrowserClient();
let getuser;

export default async function followers(req, res) {
  const origin = req.headers.host;
  if (!req.query.user) {
    res.statusCode = 404;
    res.end(`{"error": "unknown resource"}`);
    return;
  }
  const user = /\:(.*)\@/g.exec(req.query.user)[1];
  getuser = await supabase.from('accounts').select('id, username').ilike('username', `${user}`).maybeSingle();
  if (!getuser.data) {
    res.statusCode = 404;
    res.end(`{"error": "unknown resource"}`);
    return;
  }
  const followers = await getAllFollowers();
  const response = {
    "@context": "https://www.w3.org/ns/activitystreams",
    id: `https://${origin}/api/activitypub/followers?user=acct:${getuser.data.username}@rant.lol`,
    type: "OrderedCollection",
    totalItems: followers.length == null ? 0 : followers.length,
    orderedItems: followers,
  };
  respondActivityJSON(res, response);
}

export async function saveFollower(follower) {
  
  const followers = await supabase.from('accounts').select('followers').ilike('username', `${getuser.data.username}`).maybeSingle();
  let orderedItems = [];
  if (followers.data != null) {
    orderedItems = followers.data;
    if (orderedItems.includes(follower)) {
      console.log(`follower ${follower} already exists`);
      return;
    }
  }
  orderedItems.push(follower);
  // Add the reaction to the post
  if (followers.data != null) {
    let newData = { orderedItems, ...followers.data };
    const { data, error } = await supabase.from('account').update({ followers: newData }).eq('username', getuser.data.username);
    Error(error);
  } else {
    const { data, error } = await supabase.from('account').update({ followers: orderedItems }).eq('username', getuser.data.username);
    Error(error);
  }
}

export async function removeFollower(follower) {
  const followers = await getCollection(FOLLOWERS_COLLECTION);
  const data = await followers.findOne();
  let orderedItems = [];
  if (data) {
    orderedItems = data.orderedItems;
    const index = orderedItems.indexOf(follower);
    if (index !== -1) {
      orderedItems.splice(index, 1);
      await followers.updateOne({}, { $set: { orderedItems } });
      console.log(`follower ${follower} removed successfully`);
      return;
    }
  }
  console.log(`follower ${follower} not found`);
}

export async function getAllFollowers() {
  const followers = await supabase.from('accounts').select('followers').ilike('username', `${getuser.data.username}`).maybeSingle();
  if (followers.data != null) {
    return followers.data;
  }
  return [];
}