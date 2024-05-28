import torch
import os
import requests
import sys
import pandas as pd
from sentence_transformers import SentenceTransformer
from sentence_transformers.util import cos_sim
from sentence_transformers.quantization import quantize_embeddings
from s3 import zkDFS
from io import StringIO
import pickle



def select_top_k(query_embedding,df,k):
    embeddings = df['embedding']
    similarities = cos_sim(query_embedding, embeddings)
    top = torch.argsort(similarities[0],descending =True)[:k]
    docs = []
    for i in top:
        docs.append(df['sentence_chunk'][int(i)])
    return docs


if __name__ == "__main__":
    bName = 'verkel-tree-file-system-test'
    fs = zkDFS(bName)
    res = fs.get('text_chunks_and_embedding.pkl')
    proof = res['proof']
    print('merkel proof')
    print(proof)
    embedding = res['content']
    dimensions = 512
    model = SentenceTransformer("mixedbread-ai/mxbai-embed-large-v1", truncate_dim=dimensions)
    query = model.encode("teach me about convertible debt")
    my_pickel = pickle.loads(embedding)
    docs = select_top_k(query,my_pickel,3)
    for d in docs:
        print(d)
        print("\n")